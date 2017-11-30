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

client.on('ready', () => {
    console.log('Bot Initialized')
})

client.on('message', message => {
    var words = message.content.split(" ")

    if (words[0] === '!lookup') {
        if (words[1] == null) {
            return message.reply('Invalid id')
        }
        var url = 'https://api.coinmarketcap.com/v1/ticker/' + words[1]
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
                console.log("search for: " + words[1])
                if (data[0].percent_change_1h) {
                    Object.keys(data[0]).forEach(function(key) {
                        var item = data[0][key]
                        out.push(key + ":\n" + item + "\n")
                    })
                    paste.paste(out.join(""), function(err, res) {
                        message.reply(res.raw)
                    })
                    client.user.setGame(data[0].symbol + ": $" + data[0].price_usd)
                    message.channel.send({
                        embed: {
                            color: 3447003,
                            author: {
                                name: data[0].name,
                                icon_url: "http://www.urltarget.com/images/sign-flat-symbol-money-theme-action-cash-icon.png"
                            },
                            title: data[0].name,
                            description: "Most recent market data.",
                            fields: [{
                                    name: "ID",
                                    value: data[0].id || "idk"
                                },
                                {
                                    name: "Name",
                                    value: data[0].name || "idk"
                                },
                                {
                                    name: "Symbol",
                                    value: data[0].symbol || "idk"
                                },
                                {
                                    name: "Rank",
                                    value: data[0].rank || "idk"
                                },
                                {
                                    name: "USD Price",
                                    value: data[0].price_usd || "idk"
                                },
                                {
                                    name: "BTC Price",
                                    value: data[0].price_btc || "idk"
                                },
                                {
                                    name: "24h Volume (USD)",
                                    value: data[0]['24h_volume_usd'] || "idk"
                                },
                                {
                                    name: "Market Cap (USD)",
                                    value: data[0].market_cap_usd || "idk"
                                },
                                {
                                    name: "Available Supply",
                                    value: data[0].available_supply || "idk"
                                },
                                {
                                    name: "Total Supply",
                                    value: data[0].total_supply || "idk"
                                },
                                {
                                    name: "Max Supply",
                                    value: data[0].max_supply || "idk"
                                },
                                {
                                    name: "1h Change",
                                    value: data[0].percent_change_1h || "idk"
                                },
                                {
                                    name: "24h Change",
                                    value: data[0].percent_change_24h || "idk"
                                },
                                {
                                    name: "7d Change",
                                    value: data[0].percent_change_7d || "idk"
                                },
                                {
                                    name: "Last Updated",
                                    value: data[0].last_updated || "idk"
                                }
                            ],
                            timestamp: new Date(),
                            footer: {
                                icon_url: "http://icons.iconarchive.com/icons/froyoshark/enkel/512/Bitcoin-icon.png",
                                text: "Powered By Coin Market Cap"
                            }
                        }
                    })
                }
            }
        })
    }

    if (words[0] === '!deals') {
        if (words[1] == null) {
            return message.reply('Invalid grope')
        }
        message.reply("Scanning...")
        var getOut = []
        var getIn = []
        for (var t = 0; t < 1300; t += 100) {
            var url = 'https://api.coinmarketcap.com/v1/ticker/?convert=USD&start=' + t
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
                    for (var i = 0; i < 100; i++) {
                        if (data[i].percent_change_1h <= -parseFloat(words[1])) {
                            getOut.push("GET OUT OF: " + " [" + data[i].symbol + "] " + data[i].name + " drop of: " + data[i].percent_change_1h + " in last hour!\n")
                        }
                        if (data[i].percent_change_1h >= parseFloat(words[1])) {
                            getIn.push("GET IN: " + " [" + data[i].symbol + "] " + data[i].name + " rise of: " + data[i].percent_change_1h + " in last hour!\n")
                        }
                    }
                }
            })
        }
        setTimeout(function() {
            paste.paste(getOut.join(""), function(err, res) {
                message.reply("Bad Deals: " + res.raw)
            })
            paste.paste(getIn.join(""), function(err, res) {
                message.reply("Good Deals: " + res.raw)
            })
        }, 3000)
    }
})

client.login('Key')
