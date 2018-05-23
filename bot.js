const schedule = require('node-schedule')
const dateFormat = require('dateformat')
const moment = require('moment')
const mysql = require('mysql')
const Discord = require('discord.js')
const client = new Discord.Client()
const rule = new schedule.RecurrenceRule()
const request = require('request')
const Pastee = require('pastee')
const paste = new Pastee()
const config = require('./config.json');

client.on('ready', () => {
    console.log('Bot Initialized')
})

client.on('message', message => {
    var words = message.content.split(" ")

    if (words[0] === '$spk') {
        var url = 'https://api.coinmarketcap.com/v2/ticker/2448/?convert=BTC'
        var out = []
        console.log(url)
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
                client.user.setGame(data.data.symbol + ": $" + data.data.quotes.USD.price)
                var utcSeconds = data.data.last_updated;
                var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
                d.setUTCSeconds(utcSeconds);
                message.channel.send({
                    embed: {
                        color: 16733525,
                        author: {
                            name: data.data.name,
                            icon_url: "https://i.imgur.com/om7BdDb.png"
                        },
                        // title: data.data.name,
                        // description: "Most recent market data.",
                        fields: [
                            {
                                name: "Rank",
                                value: data.data.rank || "idk"
                            },
                            {
                                name: "USD Price",
                                value: "$"+data.data.quotes.USD.price.toString() || "idk"
                            },
                            {
                                name: "BTC Price",
                                value: data.data.quotes.BTC.price.toFixed(8).toString() || "idk"
                            },
                            {
                                name: "24h Volume (USD)",
                                value: "$" + data.data.quotes.USD.volume_24h.toString() || "idk"
                            },
                            {
                                name: "Price change 1H (USD)",
                                value: data.data.quotes.USD.percent_change_1h.toString()+"%" || "idk"
                            },
                            {
                                name: "Price change 24H (USD)",
                                value: data.data.quotes.USD.percent_change_24h.toString()+"%" || "idk"
                            },
                            {
                                name: "Price change 7 Days (USD)",
                                value: data.data.quotes.USD.percent_change_7d.toString()+"%" || "idk"
                            },
                            // {
                            //     name: "Market Cap (USD)",
                            //     value: data[0].market_cap_usd || "idk"
                            // },
                            // {
                            //     name: "Available Supply",
                            //     value: data[0].available_supply || "idk"
                            // },
                            // {
                            //     name: "Total Supply",
                            //     value: data[0].total_supply || "idk"
                            // },
                            {
                                name: "Max Supply",
                                value: "21000000" || "idk"
                            },
                            {
                                name: "Last Updated",
                                value: d.toString() || "idk"
                            }
                        ],
                        timestamp: new Date(),
                        footer: {
                            icon_url: "https://i.imgur.com/om7BdDb.png",
                            text: "Powered By Coin Market Cap"
                        }
                    }
                })
            }
        })
    }
})
client.login(config.token);
