// netlify/functions/oauth.js
const fetch = require("node-fetch");

const clientId = process.env.ZOOM_CLIENT_ID;
const clientSecret = process.env.ZOOM_CLIENT_SECRET;
const redirectUri = "https://melodious-parfait-c65271.netlify.app/.netlify/functions/oauth";

exports.handler = async (event) => {
    const { code } = event.queryStringParameters;

    if (!code) {
        // Zoom OAuth 로그인 URL로 리디렉션
        const zoomAuthUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
        return {
            statusCode: 302,
            headers: {
                Location: zoomAuthUrl,
            },
        };
    }

    // Zoom으로부터 받은 code를 사용해 access token 요청
    const tokenUrl = "https://zoom.us/oauth/token";
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    try {
        const response = await fetch(`${tokenUrl}?grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}`, {
            method: "POST",
            headers: {
                Authorization: `Basic ${basicAuth}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        const data = await response.json();

        if (data.access_token) {
            // 액세스 토큰을 받아왔을 때 성공 메시지
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: "Zoom OAuth 인증 성공!",
                    access_token: data.access_token,
                    refresh_token: data.refresh_token,
                    expires_in: data.expires_in,
                }),
            };
        } else {
            // 오류 메시지
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Zoom OAuth 인증 실패", error: data }),
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error during Zoom OAuth", error: error.message }),
        };
    }
};
