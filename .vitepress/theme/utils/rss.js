import { writeFileSync } from 'fs';
import { Feed } from 'feed';
import path from 'path';
import { createContentLoader } from 'vitepress';


const hostname = 'https://www.w4ter.com/';
const createRssFileZH = async (config) => {
	const feed = new Feed({
		title: 'water',
		description:
			'water的开发日志',
		id: hostname,
		link: hostname,
		language: 'zh-Hans',
		image: `${hostname}/icon-512x512.webp`,
		favicon: `${hostname}/favicon.ico`,
		copyright: 'Copyright (c) 2024-present, Water',
	});

	const posts = await createContentLoader('posts/**/*.md', {
		render: true,
	}).load();

	posts.sort((a, b) =>
		Number(+new Date(b.frontmatter.date) - +new Date(a.frontmatter.date))
	);

	for (const { url, html, frontmatter } of posts) {
		// 仅保留最近 5 篇文章
		if (feed.items.length >= 5) {
			break;
		}

		feed.addItem({
			title: frontmatter.title,
			id: `${hostname}${url}`,
			link: `${hostname}${url}`,
			description: frontmatter.desc,
			content: html,
			author: [
				{
					name: 'water',
					email: 'water@w4ter.com',
					link: 'https://www.w4ter.com/',
				},
			],
			date: frontmatter.date,
		});
	}

	writeFileSync(path.join(config.outDir, 'feed.xml'), feed.rss2(), 'utf-8');
};

export { createRssFileZH };