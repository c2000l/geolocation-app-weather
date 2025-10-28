export default {
  async fetch(request, env, ctx) {
    // 示例经纬度（北京），后面会改成使用 request.cf
    let latitude = request.cf?.latitude || 39.9042;
    let longitude = request.cf?.longitude || 116.4074;

    // 拼接 AQICN 请求 URL
    const token = "demo"; // ⚠️ demo 仅用于测试，稳定性有限
    const endpoint = `https://api.waqi.info/feed/geo:${latitude};${longitude}/?token=${token}`;

    // 模拟真实浏览器 Header
    const headers = {
      "Accept":
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      "Cache-Control": "no-cache",
      "Pragma": "no-cache",
      "Sec-CH-UA":
        '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
      "Sec-CH-UA-Mobile": "?0",
      "Sec-CH-UA-Platform": '"Windows"',
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "cross-site",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
      "Referer": "https://aqicn.org/",
      "Origin": "https://aqicn.org",
    };

    let html_style = `body{padding:3em;font-family:sans-serif;background:#fafafa;color:#222;}
h1{color:#f6821f;margin-bottom:0.5em;}`;

    let html_content = "<h1>Weather 🌦</h1>";

    try {
      // 向 AQICN 发出请求
      const response = await fetch(endpoint, { headers });
      const content = await response.json();

      if (content.status !== "ok") {
        throw new Error(content.data || "API returned error");
      }

      const city = content.data.city?.name || "Unknown";
      const aqi = content.data.aqi ?? "N/A";
      const temp = content.data.iaqi?.t?.v ?? "N/A";
      const no2 = content.data.iaqi?.no2?.v ?? "N/A";
      const o3 = content.data.iaqi?.o3?.v ?? "N/A";

      html_content += `<p>您位于: ${latitude}, ${longitude}</p>`;
      html_content += `<p>数据来源: <a href="${content.data.city.url}" target="_blank">${city}</a></p>`;
      html_content += `<p>AQI: ${aqi}</p>`;
      html_content += `<p>NO₂: ${no2}</p>`;
      html_content += `<p>O₃: ${o3}</p>`;
      html_content += `<p>温度: ${temp} °C</p>`;

    } catch (err) {
      html_content += `<p style="color:red;">❌ 发生错误: ${err.message}</p>`;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"><title>Weather Info</title></head>
        <body>
          <style>${html_style}</style>
          ${html_content}
        </body>
      </html>`;

    return new Response(html, {
      headers: { "content-type": "text/html;charset=UTF-8" },
    });
  },
};
