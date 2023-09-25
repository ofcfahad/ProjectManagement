
const shortenUrl = async (url: string) => {
    console.log('====================================');
    console.log(url);
    console.log('====================================');
    const response = await fetch('https://api-ssl.bitly.com/v4/shorten', {
        method: 'POST',
        headers: {
            'Authorization': `4f4f8cf0e45226dabc0e15c46c0be6f1e6d96b50`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "long_url": url })
    });

    const shortUrl = await response.json()

    console.log('====================================');
    console.log(shortUrl);
    console.log('====================================');

    return shortUrl.link;
}

export {
    shortenUrl
};