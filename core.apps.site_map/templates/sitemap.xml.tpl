<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    {foreach:list,l}
    <url>
        <loc>http://{http_host}/{l[url]}</loc>
        <lastmod>{l[last_modified]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.5</priority>
    </url>
    {end:}
</urlset>