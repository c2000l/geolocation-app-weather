export default {
  async fetch(request): Promise<Response> {
    let endpoint = "https://api.waqi.info/feed/geo:39.9042;116.4074/?token=demo";
    const token = ""; // 使用从 https://aqicn.org/api/ 获取的有效 token
    let html_style = `body{padding:6em; font-family: sans-serif;} h1{color:#f6821f}`;

    let html_content = "<h1>Weather 🌦</h1>";

    const latitude = request.cf.latitude;
    const longitude = request.cf.longitude;
    endpoint += `${latitude};${longitude}/?token=${token}`;
    const init = {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    };

    try {
      const response = await fetch(endpoint, init);
      const content = await response.json();
		console.log('API Response:', content);
      // 检查返回数据是否包含所需字段
      if (content.data && content.data.city && content.data.city.url) {
        html_content += `<p>This is a demo using Workers geolocation data. </p>`;
        html_content += `You are located at: ${latitude},${longitude}.</p>`;
        html_content += `<p>Based off sensor data from <a href="${content.data.city.url}">${content.data.city.name}</a>:</p>`;
        html_content += `<p>The AQI level is: ${content.data.aqi}.</p>`;
        html_content += `<p>The N02 level is: ${content.data.iaqi.no2?.v}.</p>`;
        html_content += `<p>The O3 level is: ${content.data.iaqi.o3?.v}.</p>`;
        html_content += `<p>The temperature is: ${content.data.iaqi.t?.v}°C.</p>`;
      } else {
        html_content += `<p>Could not retrieve city data or URL.</p>`;
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      html_content += `<p>Failed to fetch weather data. Please try again later.</p>`;
    }

    let html = `
      <!DOCTYPE html>
      <head>
        <title>Geolocation: Weather</title>
      </head>
      <body>
        <style>${html_style}</style>
        <div id="container">
        ${html_content}
        </div>
      </body>`;

    return new Response(html, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    });
  },
} satisfies ExportedHandler;
