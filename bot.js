const schedule = require('node-schedule')
const dateFormat = require('dateformat')
const moment = require('moment')
const Discord = require('discord.js')
const client = new Discord.Client()
const rule = new schedule.RecurrenceRule()
const request = require('request')
const config = require('./config.json');

client.on('ready', () => {
    console.log('Bot Initialized')
})

client.on('message', message => {
    var words = message.content.split(" ")

    if (words[0] === '$spk') {
        var url = 'https://api.coinmarketcap.com/v2/ticker/2448/?convert=BTC'
        var out = []
        // console.log(url)
        request.get({
            url: url,
            json: true,
            headers: {
                'User-Agent': 'request'
            }
        }, (err, res, data) => {
            if (err) {
                message.reply("?")
            } else if (res.statusCode !== 200) {
                message.reply("?")
            } else {
                client.user.setActivity(data.data.symbol + ": $" + data.data.quotes.USD.price)
                var utcSeconds = data.data.last_updated;
                var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
                d.setUTCSeconds(utcSeconds);

                var coinPriceUSD = data.data.quotes.USD.price.toString();
                var coinPriceBTC = data.data.quotes.BTC.price.toFixed(8).toString();
                var coinVolume = data.data.quotes.USD.volume_24h.toString();

                // Because CMC data is a little outdated we cannot estimate market cap, circulating supply or current supply
                var coinName = data.data.name;
                var coinSymbol = data.data.symbol;
                var coinRank = data.data.rank;
                var coinMaxSupply = "21,000,000";
                var coinCap = "N/A";

                var coinUp = "<:indicator_up:449091710048272385>";
                var coinDown = "<:indicator_down:449092038965854212>";
                var btcIcon = "<:icon_bitcoin:449088706456977418>";
                var usdIcon = "<:icon_dollar:449093637624561664>";

                var coinChange1h = `**Hour:** ${coinUp} ${data.data.quotes.USD.percent_change_1h}%`;
                if (data.data.quotes.USD.percent_change_1h && data.data.quotes.USD.percent_change_1h.toString().startsWith('-')) {
                  coinChange1h = `**Hour:** ${coinDown} ${data.data.quotes.USD.percent_change_1h}%`;
                }
                coinChange24h = `**Day:** ${coinUp} ${data.data.quotes.USD.percent_change_24h}%`;
                if (data.data.quotes.USD.percent_change_24h && data.data.quotes.USD.percent_change_24h.toString().startsWith('-')) {
                  coinChange24h = `**Day:** ${coinDown} ${data.data.quotes.USD.percent_change_24h}%`;
                }
                coinChange7d = `**Week:** ${coinUp} ${data.data.quotes.USD.percent_change_7d}%`;
                if (data.data.quotes.USD.percent_change_7d && data.data.quotes.USD.percent_change_7d.toString().startsWith('-')) {
                  coinChange7d = `**Week:** ${coinDown} ${data.data.quotes.USD.percent_change_7d}%`;
                }

                message.channel.send({
                    embed: {
                        color: 16733525,
                        author: {
                            name: coinName + " (" + coinSymbol + ")",
                            icon_url: "https://i.imgur.com/om7BdDb.png"
                        },
                        fields: [
                            {
                                name: "Price",
                                value: `${usdIcon} **USD:** $${coinPriceUSD}\n${btcIcon} **BTC:** ${coinPriceBTC}\n`,
                                inline: true
                            },
                            {
                                name: "Price Changes",
                                value: `${coinChange1h}\n${coinChange24h}\n${coinChange7d}`,
                                inline: true
                            },
                            {
                                name: "Coin Information",
                                value: `**CMC Rank:** ${coinRank}\n**Market Cap:** ${coinCap}`,
                                inline: true
                            },
                            {
                                name: "\u200C",
                                value: `**24H Volume:** $${coinVolume}\n**Max Supply:** ${coinMaxSupply} SPK`,
                                inline: true
                            }
                        ],
                        thumbnail: {
                          url: "https://i.imgur.com/om7BdDb.png"
                        },
                        timestamp: new Date(),
                        footer: {
                            text: "Powered by CoinMarketCap"
                        }
                    }
                })
            }
        })
    }
})
client.login(config.token);
