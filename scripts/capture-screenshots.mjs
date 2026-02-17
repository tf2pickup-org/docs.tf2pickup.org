/**
 * Captures screenshots for tf2pickup.org documentation.
 *
 * Prerequisites:
 *   - Local tf2pickup v4 running at http://localhost:3000
 *   - ENABLE_TEST_AUTH=true in .env
 *   - DISCORD_BOT_TOKEN uncommented in .env
 *   - Database loaded with tf2pickup.pl dump
 *   - MongoDB accessible via docker exec tf2pickup-htmx-nodejs-mongo-1
 *
 * Usage:
 *   npx playwright install chromium
 *   node scripts/capture-screenshots.mjs
 */

import { chromium } from 'playwright'
import { mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execFileSync } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const STATIC_DIR = resolve(__dirname, '..', 'static', 'img', 'content')
const BASE_URL = 'http://localhost:3000'
const VIEWPORT = { width: 1600, height: 900 }

// Super user from the tf2pickup.pl database dump
const SUPER_USER = '76561198074409147'

// A regular player (no admin roles) from the database for non-admin views
const REGULAR_PLAYER = '76561198090785419'

// A brand-new dummy player for registration flow screenshots (accept rules dialog, etc.)
const NEW_PLAYER = {
  steamId: '76561199999999999',
  name: 'NewPlayer',
  avatar: 'fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb',
}

// Fake players to populate the queue (use avatars from real players in the dump)
const FAKE_PLAYERS = [
  { steamId: '76561199195756652', name: 'Promenader', avatar: 'fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb' },
  { steamId: '76561199195935001', name: 'Mayflower', avatar: '34525988887c731145eb2302b89be469257459ec' },
  { steamId: '76561199195486701', name: 'Polemic', avatar: '974377c56a833204d53195fae34e151907d8aa84' },
  { steamId: '76561199195468328', name: 'Shadowhunter', avatar: 'ceb67cec9bfc0d73de18e5004ee849534d740949' },
  { steamId: '76561199195972852', name: 'MoonMan', avatar: 'e160ed7b362168bc83efd731fe7a0376e526832e' },
  { steamId: '76561199195926019', name: 'Underfire', avatar: 'f562c91e5ff18da4c6adc8e326616914468fa381' },
  { steamId: '76561199195611071', name: 'Astropower', avatar: '92eee1eca96618fe08a392467ca62512904c5801' },
  { steamId: '76561199195733445', name: 'LlamaDrama', avatar: '98e37db3431b808d2d624464aa7aabce408f13e2' },
  { steamId: '76561199195601536', name: 'SlitherTuft', avatar: 'a40b7478ad080f8ab8665c8665987e9d8862cc5a' },
  { steamId: '76561199196157187', name: 'Blacklight', avatar: '7d978841542273ae58a8fc0126aad0e71bc9e29d' },
  { steamId: '76561199195855422', name: 'AstraGirl', avatar: 'd2b721a2d179887476b06d0f007ed9534cf5b0e2' },
  { steamId: '76561199195188363', name: 'BellBoy', avatar: 'b4771bbe7d200006dcc1554414d07c4d91e88e04' },
]

// 6v6 slot assignments for the fake players (not all slots filled to avoid
// triggering the ready-up phase)
const SLOT_ASSIGNMENTS = [
  { player: 0, slot: 'scout-1' },
  { player: 1, slot: 'scout-2' },
  { player: 2, slot: 'scout-3' },
  { player: 4, slot: 'soldier-1' },
  { player: 5, slot: 'soldier-4' },
  { player: 8, slot: 'demoman-1' },
  { player: 10, slot: 'medic-1' },
]

function ensureDir(filepath) {
  mkdirSync(dirname(filepath), { recursive: true })
}

function imgPath(category, filename) {
  const p = resolve(STATIC_DIR, category, filename)
  ensureDir(p)
  return p
}

async function waitForPage(page) {
  await page.waitForLoadState('networkidle')
  // Give HTMX a moment to settle
  await page.waitForTimeout(500)
}

async function loginAs(page, steamId) {
  await page.goto(`${BASE_URL}/auth/test?steamId=${steamId}`, {
    waitUntil: 'networkidle',
  })
  await page.waitForTimeout(1000)
  const cookies = await page.context().cookies()
  const sessionCookie = cookies.find(c => c.name === 'session')
  if (!sessionCookie) {
    throw new Error('Login failed - no session cookie')
  }
  console.log(`  Logged in as ${steamId}`)
}

async function screenshot(page, category, filename) {
  const path = imgPath(category, filename)
  await page.screenshot({ path, type: 'png' })
  console.log(`  ✓ ${category}/${filename}`)
}

async function screenshotElement(page, selector, category, filename) {
  const el = await page.waitForSelector(selector, { timeout: 5000 })
  const path = imgPath(category, filename)
  await el.screenshot({ path, type: 'png' })
  console.log(`  ✓ ${category}/${filename} (element)`)
}

// ─── Database helpers ───────────────────────────────────────────────

function mongosh(js) {
  return execFileSync(
    'docker',
    ['exec', 'tf2pickup-htmx-nodejs-mongo-1', 'mongosh', '--quiet', '--eval', js, 'tf2pickup'],
    { encoding: 'utf-8' },
  ).trim()
}

function upsertFakePlayers() {
  console.log('\n🗃️  Upserting fake players into database...')
  for (const p of FAKE_PLAYERS) {
    const avatarBase = `https://avatars.steamstatic.com/${p.avatar}`
    mongosh(`
      db.players.updateOne(
        { steamId: "${p.steamId}" },
        { $set: {
          name: "${p.name}",
          joinedAt: new Date(),
          avatar: {
            small: "${avatarBase}.jpg",
            medium: "${avatarBase}_medium.jpg",
            large: "${avatarBase}_full.jpg"
          },
          roles: [],
          hasAcceptedRules: true,
          cooldownLevel: 0,
          preferences: {},
          stats: { totalGames: 0, gamesByClass: {} }
        },
        $unset: { activeGame: 1 }
        },
        { upsert: true }
      )
    `)
    console.log(`  ✓ ${p.name} (${p.steamId})`)
  }
}

function createNewPlayer() {
  console.log('\n🗃️  Creating new player for registration flow...')
  const p = NEW_PLAYER
  const avatarBase = `https://avatars.steamstatic.com/${p.avatar}`
  mongosh(`
    db.players.updateOne(
      { steamId: "${p.steamId}" },
      { $set: {
        name: "${p.name}",
        joinedAt: new Date(),
        avatar: {
          small: "${avatarBase}.jpg",
          medium: "${avatarBase}_medium.jpg",
          large: "${avatarBase}_full.jpg"
        },
        roles: [],
        hasAcceptedRules: false,
        cooldownLevel: 0,
        preferences: {},
        stats: { totalGames: 0, gamesByClass: {} }
      },
      $unset: { activeGame: 1 }
      },
      { upsert: true }
    )
  `)
  console.log(`  ✓ ${p.name} (${p.steamId}) with hasAcceptedRules: false`)
}

function cleanupNewPlayer() {
  mongosh(`db.players.deleteOne({ steamId: "${NEW_PLAYER.steamId}" })`)
}

function cleanupFakePlayers() {
  console.log('\n🧹 Cleaning up fake players from database...')
  const steamIds = FAKE_PLAYERS.map(p => `"${p.steamId}"`).join(',')
  mongosh(`db.players.deleteMany({ steamId: { $in: [${steamIds}] } })`)
  cleanupNewPlayer()
}

// ─── Queue population ───────────────────────────────────────────────

async function populateQueue(browser) {
  console.log('\n👥 Populating queue with fake players...')
  const contexts = []
  const pages = []

  // Process in batches of 6 to avoid overwhelming the server
  for (let i = 0; i < SLOT_ASSIGNMENTS.length; i += 6) {
    const batch = SLOT_ASSIGNMENTS.slice(i, i + 6)
    await Promise.all(
      batch.map(async ({ player: playerIdx, slot }) => {
        const p = FAKE_PLAYERS[playerIdx]
        const ctx = await browser.newContext({ viewport: VIEWPORT })
        contexts.push(ctx)
        const page = await ctx.newPage()
        pages.push(page)

        // Log in
        await page.goto(`${BASE_URL}/auth/test?steamId=${p.steamId}`, {
          waitUntil: 'networkidle',
        })
        await page.waitForTimeout(500)

        // Navigate to queue
        await page.goto(BASE_URL + '/')
        await waitForPage(page)

        // Click the join button for this slot
        const joinButton = page.getByRole('button', { name: `Join queue on slot ${slot}` })
        await joinButton.click()
        await page.waitForTimeout(300)

        console.log(`  ✓ ${p.name} joined ${slot}`)
      }),
    )
  }

  // Have some players vote for maps to show vote percentages.
  // After joining, the vote buttons become enabled via client-side reactivity.
  // We need to wait a moment for the isInQueue state to propagate.
  console.log('  Casting map votes...')
  await new Promise(r => setTimeout(r, 1000))
  for (let i = 0; i < Math.min(pages.length, 5); i++) {
    const pg = pages[i]
    // First 3 players vote for the first map, next 2 for the second
    const mapIdx = i < 3 ? 0 : 1
    const voteButtons = pg.locator('button[aria-label^="Vote for map"]')
    const count = await voteButtons.count()
    if (count > mapIdx) {
      const btn = voteButtons.nth(mapIdx)
      // Force-click even if disabled attr is still settling
      await btn.click({ force: true, timeout: 3000 }).catch(() => {})
      await pg.waitForTimeout(200)
    }
  }
  console.log('  ✓ Map votes cast')

  return contexts
}

async function drainQueue(contexts) {
  console.log('\n🚪 Draining queue (closing fake player sessions)...')
  for (const ctx of contexts) {
    await ctx.close()
  }
  // Give the server time to process disconnections
  await new Promise(resolve => setTimeout(resolve, 2000))
}

// ─── Main ───────────────────────────────────────────────────────────

async function main() {
  const browser = await chromium.launch({ headless: true })

  // Set up fake players in the database
  upsertFakePlayers()

  // ─── Queue screenshot with players ──────────────────────────────
  console.log('\n📸 Queue screenshot (with players)...')
  const queueContexts = await populateQueue(browser)

  // Take the queue screenshot from a non-logged-in perspective
  {
    const ctx = await browser.newContext({ viewport: VIEWPORT })
    const page = await ctx.newPage()
    await page.goto(BASE_URL + '/')
    await waitForPage(page)
    await screenshot(page, 'overview', 'pickup-queue.png')
    await ctx.close()
  }

  // Drain the queue before taking other screenshots
  await drainQueue(queueContexts)

  // ─── Overview screenshots (NOT logged in) ───────────────────────
  console.log('\n📸 Overview screenshots (public view)...')
  {
    const ctx = await browser.newContext({ viewport: VIEWPORT })
    const page = await ctx.newPage()

    // Player list
    await page.goto(BASE_URL + '/players')
    await waitForPage(page)
    await screenshot(page, 'overview', 'player-list.png')

    // Player profile (no admin toolbox visible)
    await page.goto(BASE_URL + `/players/${REGULAR_PLAYER}`)
    await waitForPage(page)
    await screenshot(page, 'overview', 'player-profile.png')

    // Stats
    await page.goto(BASE_URL + '/statistics')
    await waitForPage(page)
    await screenshot(page, 'overview', 'stats.png')

    // Hall of fame
    await page.goto(BASE_URL + '/hall-of-fame')
    await waitForPage(page)
    await screenshot(page, 'overview', 'hall-of-fame.png')

    // Rules page
    await page.goto(BASE_URL + '/rules')
    await waitForPage(page)
    await screenshot(page, 'overview', 'rules-page.png')

    // Game overview (public view, no admin buttons)
    await page.goto(BASE_URL + '/games')
    await waitForPage(page)
    const gameLinks = await page.$$('a[href^="/games/"]')
    if (gameLinks.length > 0) {
      await gameLinks[0].click()
      await waitForPage(page)
      await screenshot(page, 'overview', 'pickup-game-overview-after-a-game.png')
    }

    await ctx.close()
  }

  // ─── Admin overview screenshots (logged in as super user) ───────
  console.log('\n📸 Admin overview screenshots...')
  const adminCtx = await browser.newContext({ viewport: VIEWPORT })
  const page = await adminCtx.newPage()
  await loginAs(page, SUPER_USER)

  // Admin panel (redirects to /admin/player-restrictions)
  await page.goto(BASE_URL + '/admin')
  await waitForPage(page)
  await screenshot(page, 'overview', 'admin-panel.png')

  // Player action log
  await page.goto(BASE_URL + '/admin/player-action-logs')
  await waitForPage(page)
  await screenshot(page, 'overview', 'player-action-log.png')

  // Settings page (user settings / Twitch integration)
  await page.goto(BASE_URL + '/settings')
  await waitForPage(page)
  await screenshot(page, 'overview', 'integrate-twitch-account.png')

  // ─── Common admin tasks ───────────────────────────────────────────
  console.log('\n📸 Common tasks screenshots...')

  // Scramble maps
  await page.goto(BASE_URL + '/admin/scramble-maps')
  await waitForPage(page)
  await screenshot(page, 'common-tasks', 'scramble-maps.png')

  // Player profile as admin (shows skill editing toolbox + edit button)
  await page.goto(BASE_URL + `/players/${REGULAR_PLAYER}`)
  await waitForPage(page)
  await screenshot(page, 'common-tasks', 'find-profile-to-ban.png')
  // Same page also serves as the skill editing screenshot
  await screenshot(page, 'common-tasks', 'set-skills-for-a-player.png')

  // Player bans page
  await page.goto(BASE_URL + `/players/${REGULAR_PLAYER}/edit/bans`)
  await waitForPage(page)
  await screenshot(page, 'common-tasks', 'player-bans-menu.png')

  // Add ban form - duration mode (default)
  await page.goto(BASE_URL + `/players/${REGULAR_PLAYER}/edit/bans/add`)
  await waitForPage(page)
  await screenshot(page, 'common-tasks', 'ban-player-duration.png')

  // Add ban form - end date mode
  await page.click('#lengthSelectorEndDate')
  await page.waitForTimeout(300)
  await screenshot(page, 'common-tasks', 'ban-player-enddate.png')

  // Add ban form - forever mode
  await page.click('#lengthSelectorForever')
  await page.waitForTimeout(300)
  await screenshot(page, 'common-tasks', 'ban-player-forever.png')

  // Player edit profile (nickname, cooldown level)
  await page.goto(BASE_URL + `/players/${REGULAR_PLAYER}/edit/profile`)
  await waitForPage(page)
  await screenshot(page, 'common-tasks', 'open-player-skill-table.png')

  // ─── Website settings screenshots ─────────────────────────────────
  console.log('\n📸 Website settings screenshots...')

  // Map pool
  await page.goto(BASE_URL + '/admin/map-pool')
  await waitForPage(page)
  await screenshot(page, 'website-settings', 'set-map-pool.png')

  // Game configuration
  await page.goto(BASE_URL + '/admin/games')
  await waitForPage(page)
  await screenshot(page, 'website-settings', 'game-configuration.png')

  // Player restrictions (also shows default player skill values)
  await page.goto(BASE_URL + '/admin/player-restrictions')
  await waitForPage(page)
  await screenshot(page, 'website-settings', 'player-restrictions.png')

  // Advanced server configuration (view-for-nerds)
  await page.goto(BASE_URL + '/admin/view-for-nerds')
  await waitForPage(page)
  await screenshot(page, 'website-settings', 'advanced-server-configuration.png')

  // Bypass registration restrictions
  await page.goto(BASE_URL + '/admin/bypass-registration-restrictions')
  await waitForPage(page)
  await screenshot(page, 'website-settings', 'bypass-registration-restrictions.png')

  // ─── Final touches screenshots ────────────────────────────────────
  console.log('\n📸 Final touches screenshots...')

  // Rules editor
  await page.goto(BASE_URL + '/admin/rules')
  await waitForPage(page)
  await screenshot(page, 'final-touches', 'edit-rules.png')

  // Privacy policy editor
  await page.goto(BASE_URL + '/admin/privacy-policy')
  await waitForPage(page)
  await screenshot(page, 'final-touches', 'edit-privacy-policy.png')

  // Game servers
  await page.goto(BASE_URL + '/admin/game-servers')
  await waitForPage(page)
  await screenshot(page, 'final-touches', 'game-servers-configuration.png')

  // Voice chat settings
  await page.goto(BASE_URL + '/admin/voice-server')
  await waitForPage(page)
  await screenshot(page, 'final-touches', 'voice-chat-settings.png')

  // Player roles (super user only)
  await page.goto(BASE_URL + `/players/${REGULAR_PLAYER}/edit/roles`)
  await waitForPage(page)
  await screenshot(page, 'final-touches', 'player-roles.png')

  // Skill import/export
  await page.goto(BASE_URL + '/admin/skill-import-export')
  await waitForPage(page)
  await screenshot(page, 'final-touches', 'import-players-skill.png')

  // Discord settings
  await page.goto(BASE_URL + '/admin/discord')
  await waitForPage(page)
  await screenshot(page, 'site-components-deployment', 'discord-settings.png')

  // ─── Player settings ──────────────────────────────────────────────
  console.log('\n📸 Player settings screenshots...')

  await page.goto(BASE_URL + '/settings')
  await waitForPage(page)
  await screenshot(page, 'player-settings', 'player-settings.png')

  // ─── Registration flow screenshots ─────────────────────────────
  console.log('\n📸 Registration flow screenshots...')
  createNewPlayer()
  {
    const ctx = await browser.newContext({ viewport: VIEWPORT })
    const regPage = await ctx.newPage()
    await loginAs(regPage, NEW_PLAYER.steamId)
    await regPage.goto(BASE_URL + '/')
    await waitForPage(regPage)
    // Wait for the accept rules dialog to appear
    await regPage.waitForSelector('dialog[title="Accept rules dialog"]', { timeout: 5000 })
    await regPage.waitForTimeout(500)
    await screenshot(regPage, 'final-touches', 'accept-site-rules.png')
    await ctx.close()
  }

  // ─── Ban from player perspective ──────────────────────────────
  console.log('\n📸 Ban from player perspective...')
  // Accept rules for NewPlayer first so the ban banner is visible
  mongosh(`db.players.updateOne({ steamId: "${NEW_PLAYER.steamId}" }, { $set: { hasAcceptedRules: true } })`)
  // Ban the new player via the admin form
  {
    await page.goto(BASE_URL + `/players/${NEW_PLAYER.steamId}/edit/bans/add`)
    await waitForPage(page)
    // Select "forever" and fill in a reason
    await page.click('#lengthSelectorForever')
    await page.fill('#banReason', 'Breaking site rules')
    await page.click('button[type="submit"]')
    await waitForPage(page)
    console.log('  ✓ Banned NewPlayer')

    // Now log in as the banned player and see the ban notice
    const ctx = await browser.newContext({ viewport: VIEWPORT })
    const bannedPage = await ctx.newPage()
    await loginAs(bannedPage, NEW_PLAYER.steamId)
    await bannedPage.goto(BASE_URL + '/')
    await waitForPage(bannedPage)
    await bannedPage.waitForTimeout(500)
    await screenshot(bannedPage, 'common-tasks', 'ban-from-player-perspective.png')
    await ctx.close()
  }

  // ─── Cleanup ────────────────────────────────────────────────────
  await browser.close()
  cleanupFakePlayers()
  console.log('\n✅ Done!')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
