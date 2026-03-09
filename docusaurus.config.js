/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'tf2pickup.org',
  tagline: 'Team Fortress 2 pick-up games',
  url: 'https://docs.tf2pickup.org',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'tf2pickup.org',
  projectName: 'docs.tf2pickup.org',
  themeConfig: {
    navbar: {
      title: 'tf2pickup.org',
      logo: {
        alt: 'tf2pickup.org logo',
        src: 'img/logo.png',
      },
      items: [
        {
          to: 'docs/about',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://github.com/tf2pickup-org',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'About tf2pickup.org',
              to: 'docs/about',
            },
            {
              label: 'For pickup admins and players',
              to: 'docs/admin-responsibilities-and-powers'
            },
            {
              label: 'For server admins',
              to: 'docs/components-introduction'
            },
            {
              label: 'For developers',
              to: 'docs/server-api'
            }
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/SXtcadpQTK',
            }
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Our website',
              href: 'https://tf2pickup.org',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/tf2pickup-org',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} tf2pickup.org, Inc. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/tf2pickup-org/docs.tf2pickup.org',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
