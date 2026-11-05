import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'ml101';
const owner = process.env.GITHUB_REPOSITORY?.split('/')[0] ?? 'USERNAME';

const config: Config = {
  title: 'ML101 — Introduction to Machine Learning',
  tagline: 'A university course for undergraduate Economics students',
  favicon: 'img/favicon.svg',
  url: process.env.SITE_URL || `https://${owner}.github.io`,
  baseUrl: process.env.BASE_URL || `/${repo}/`,
  organizationName: owner,
  projectName: repo,
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  markdown: { hooks: { onBrokenMarkdownLinks: 'throw' } },
  trailingSlash: false,
  i18n: { defaultLocale: 'en', locales: ['en'] },
  presets: [
    [
      'classic',
      {
        docs: { routeBasePath: 'lectures', sidebarPath: './sidebars.ts', editUrl: undefined },
        blog: false,
        theme: { customCss: './src/css/custom.css' },
      },
    ],
  ],
  themeConfig: {
    colorMode: { defaultMode: 'light', disableSwitch: true, respectPrefersColorScheme: false },
    navbar: {
      title: 'ML101',
      logo: { alt: 'ML101 mark', src: 'img/mark.svg' },
      items: [
        { to: '/', label: 'Home', position: 'left' },
        { to: '/material', label: 'Material', position: 'left' },
        { to: '/about', label: 'About', position: 'right' },
      ],
    },
    footer: {
      style: 'light',
      links: [
        { title: 'Explore', items: [{ label: 'Home', to: '/' }, { label: 'Material', to: '/material' }, { label: 'About', to: '/about' }] },
      ],
      copyright: `© ${new Date().getFullYear()} Andrea Giussani<br /><small>If you reuse this educational material, you must cite it as: Andrea Giussani (2026), probablyml.com. The original content is licensed under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. Please indicate adaptations and retain citations to the original sources.</small>`,
    },
    prism: { theme: prismThemes.github },
  } satisfies Config['themeConfig'],
};

export default config;
