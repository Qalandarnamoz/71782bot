const { Telegraf, Markup } = require('telegraf')
require('dotenv').config()
let photo = ''
let tk = 0
let elon = false
let key = ''
const date = new Date()
const CronJob = require('cron').CronJob



const month = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr']
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://Muhammad:71782abs@cluster0.lljrm.mongodb.net/akkauntId?retryWrites=true&w=majority')
    .then(() => {
        console.log('bazaga ulandi');
    })
    .catch(e => {
        console.log('xatolik', e);
    })
    //helloll
const UsersSchema = new mongoose.Schema({
    name: String,
    idNumber: Number,
    day: Number,
    month: Number


})

const LaykSchema = new mongoose.Schema({
    layk: Number

})

const PhotoUrlSchema = new mongoose.Schema({
    url: String
})
const PhotoUrl = new mongoose.model("PhotoUrl", PhotoUrlSchema)
const User = new mongoose.model("User", UsersSchema)
const Layk = new mongoose.model("Layk", LaykSchema)
const bot = new Telegraf(process.env.BOT_TOKEN)



const job = new CronJob('00 18 * * *', async() => {
    const photourl = await PhotoUrl.findById('61b5a7464f12aeb80d5ee100')
    photo = photourl.url

    let str = '🕰 Namoz vaqtlari!  ' + date.getDate() + 1 + ' - ' + month[date.getMonth()] + '  ' + date.getFullYear() + ' yil'
    await bot.telegram.sendPhoto(process.env.chatID, photo)
    await bot.telegram.sendMessage(process.env.chatID, str)
}, null, true)
job.start()

const time = new CronJob('59 23 * * *', async() => {
    const Layks = await Layk.findById('61b5737108dd84ef1697f680')
    Layks.layk = Layks.layk + 1
    await Layks.save()
}, null, true)
time.start()


bot.command('/start@Qalandarxona_bot', async(ctx) => {
        ctx.replyWithHTML(`${ctx.from.first_name} Sizga xabar yuborildi!`)
        ctx.telegram.sendMessage(ctx.from.id, 'Assalomu alaykum! botdan foydalanish uchun /start ni bosing!')
    }

)

bot.start(async(ctx) => {
    if (parseInt(ctx.from.id) === parseInt(process.env.admin_J) || parseInt(ctx.from.id) === parseInt(process.env.admin_G)) {
        ctx.reply('Tanlang!', Markup.inlineKeyboard([
            [Markup.button.callback('admin', 'admin'), Markup.button.callback('client', 'client')]
        ]))


        bot.action('admin', async ctx => {
            key = process.env.admin_key


            await ctx.replyWithHTML(`<b>${ctx.from.first_name}</b> (Admin) hush kelibsiz! `)
            await ctx.answerCbQuery()



            ctx.reply('E`lonni yoki namoz vaqtlarini yuboring!')
            bot.on('text', async ctx => {

                if ((parseInt(ctx.from.id) === parseInt(process.env.admin_J) || parseInt(ctx.from.id) === parseInt(process.env.admin_G)) && key === 'admin') {
                    ctx.telegram.sendMessage(process.env.chatID, ctx.message.text)
                    ctx.reply('E`lon yuborildi!')
                    ctx.reply('E`lonlar tugagan bo`lsa bosh menuga o`ting  ?', Markup.inlineKeyboard([
                        [Markup.button.callback('Bosh menu', 'bosh_menu')]
                    ]))
                } else {
                    if (key === 'client') {








                        const photourl = await PhotoUrl.findById('61b5a7464f12aeb80d5ee100')
                        photo = photourl.url
                        let str = '🕓 Namoz vaqtlari!  ' + date.getDate() + ' - ' + month[date.getMonth()] + '  ' + date.getFullYear() + ' yil \n Payshanba vaqti bilan'


                        let i = 0



                        let th = ''
                        switch (ctx.message.text) {
                            case 'Namoz vaqtlarini qayta yuklash':
                                await bot.telegram.sendPhoto(ctx.from.id, photo)
                                await bot.telegram.sendMessage(ctx.from.id, str);

                                break;

                            case 'Botni qayta ishga tushirish':
                                ctx.reply('/start ni bosing!')
                                break;
                            case 'Barcha botlar ro`yxati':
                                ctx.replyWithHTML('<b><i>1.</i></b> Payshanba: <b>@Qalandarxona_bot</b>');
                                break;
                            case 'Botni to`xtatish':
                                await User.deleteOne({ idNumber: ctx.from.id })

                                ctx.replyWithHTML('<b><i>Bot to`xtatildi! endi bot sizga xabar yubormaydi.🥵</i> Botdan qayta foydalanish uchun uni qayta ishga tushiring /start!</b>')
                                break;

                            case 'Qalandarxona telegram guruhiga o`tish':
                                ctx.reply('https://t.me/Qalandarxona_Jome_Masjidi')
                                break;
                            case 'Statistika':
                                const Users = await User.find({})
                                    .select({ idNumber: 1 })

                                const UsersDay = await User.find({
                                        day: parseInt(date.getDate())
                                    })
                                    .select({ idNumber: 1 })

                                const UsersMonth = await User.find({
                                        month: parseInt(date.getMonth()) + 1
                                    })
                                    .select({ idNumber: 1 })
                                const Layks = await Layk.findById('61b5737108dd84ef1697f680')

                                ctx.replyWithHTML(`Botdagi obunachilar: ${Users.length} \n\n Bugun qo\`shilgan obunachilar: ${UsersDay.length} ta \n Oxirgi 1 oyda qo\`shilgan obunachilar: ${25+parseInt(UsersMonth.length)} ta \n Bot ishga tushganiga ${Layks.layk} kun bo\`ldi \n\n @@Qalandarxona_bot statistikasi`)
                                break;





                        }





                    }
                }
                return 0;
            })

            bot.on('photo', async ctx => {

                if (parseInt(ctx.from.id) === parseInt(process.env.admin_J) || parseInt(ctx.from.id) === parseInt(process.env.admin_G)) {
                    const photourl = await PhotoUrl.findById('61b5a7464f12aeb80d5ee100')

                    photourl.url = ctx.message.photo[0].file_id
                    await photourl.save()
                    photo = photourl.url

                    ctx.reply('Rasm qabul qilindi!')
                    ctx.replyWithHTML('<b>Rasmni botdan foydalanuvchilarga yuborishni aniq istaysizmi ?</b>', Markup.inlineKeyboard([
                        [Markup.button.callback('HA', 'photoSend')],
                        [Markup.button.callback('Yo`q', 'photoNosend')]
                    ]))
                }
            })
            ctx.answerCbQuery()




            bot.action('photoSend', async ctx => {
                let str = 'Namoz vaqti o`zgardi! 📣🕙 ' + date.getDate() + ' - ' + month[date.getMonth()] + '  ' + date.getFullYear() + ' yil'
                ctx.telegram.sendPhoto(process.env.chatID, photo)
                ctx.telegram.sendMessage(process.env.chatID, str)

                ctx.reply('Namoz vaqti bot foydalanuvchilariga yuborildi!')



                await ctx.answerCbQuery()

            })


        })
        bot.action('bosh_menu', async ctx => {

            ctx.reply('Tanlang!', Markup.inlineKeyboard([
                [Markup.button.callback('admin', 'admin'), Markup.button.callback('client', 'client')]
            ]))
            await ctx.answerCbQuery()
        })

        bot.action('client', async ctx => {
            await ctx.answerCbQuery()
            key = process.env.client_key

            if (key === 'client') {
                const Users = await User.find({
                        idNumber: ctx.from.id
                    })
                    .select({ idNumber: 1 })
                if (Users.length >= 1) {

                } else {

                    async function creatUser() {
                        const user = new User({
                            name: ctx.from.first_name,
                            idNumber: ctx.from.id,
                            day: parseInt(date.getDate()),
                            month: parseInt(date.getMonth()) + 1


                        })

                        await user.save()
                    }
                    creatUser()
                }





                ctx.replyWithHTML(`Assalomu alaykum ${ctx.from.first_name}! botimizga xush kelibsiz! \n  Endi sizni ushbu bot,  har safar jamoat namozi vaqtlari o\`zgargani haqida xabardor qiladi!`)
                const photourl = await PhotoUrl.findById('61b5a7464f12aeb80d5ee100')
                photo = photourl.url
                let str = '🕓 Namoz vaqtlari!  ' + date.getDate() + ' - ' + month[date.getMonth()] + '  ' + date.getFullYear() + ' yil \n Payshanba vaqti bilan'
                await ctx.telegram.sendPhoto(ctx.from.id, photo)

                ctx.telegram.sendMessage(ctx.from.id, str, {
                    reply_markup: {
                        keyboard: [
                            ['Namoz vaqtlarini qayta yuklash'],

                            ['Statistika', 'Barcha botlar ro`yxati'],
                            ['Botni to`xtatish', 'Botni qayta ishga tushirish'],
                            ['Qalandarxona telegram guruhiga o`tish']


                        ]
                    }
                })
                let i = 0
                bot.on('message', async ctx => {
                    if (key === 'client') {
                        let th = ''
                        switch (ctx.message.text) {
                            case 'Namoz vaqtlarini qayta yuklash':
                                await bot.telegram.sendPhoto(ctx.from.id, photo)
                                await bot.telegram.sendMessage(ctx.from.id, str);

                                break;

                            case 'Botni qayta ishga tushirish':
                                ctx.reply('/start ni bosing!')
                                break;
                            case 'Barcha botlar ro`yxati':
                                ctx.replyWithHTML('<b><i>1.</i></b> Payshanba: <b>@Qalandarxona_bot</b>');
                                break;
                            case 'Botni to`xtatish':
                                await User.deleteOne({ idNumber: ctx.from.id })

                                ctx.replyWithHTML('<b><i>Bot to`xtatildi! endi bot sizga xabar yubormaydi.🥵</i> Botdan qayta foydalanish uchun uni qayta ishga tushiring /start!</b>')
                                break;

                            case 'Qalandarxona telegram guruhiga o`tish':
                                ctx.reply('https://t.me/Qalandarxona_Jome_Masjidi')
                                break;
                            case 'Statistika':
                                const Users = await User.find({})
                                    .select({ idNumber: 1 })

                                const UsersDay = await User.find({
                                        day: parseInt(date.getDate())
                                    })
                                    .select({ idNumber: 1 })

                                const UsersMonth = await User.find({
                                        month: parseInt(date.getMonth()) + 1
                                    })
                                    .select({ idNumber: 1 })
                                const Layks = await Layk.findById('61b5737108dd84ef1697f680')

                                ctx.replyWithHTML(`Botdagi obunachilar: ${Users.length} \n\n Bugun qo\`shilgan obunachilar: ${UsersDay.length} ta \n Oxirgi 1 oyda qo\`shilgan obunachilar: ${25+parseInt(UsersMonth.length)} ta \n Bot ishga tushganiga ${Layks.layk} kun bo\`ldi \n\n @@Qalandarxona_bot statistikasi`)
                                break;





                        }
                    } else {
                        ctx.telegram.sendMessage(process.env.chatID, ctx.message.text)
                        ctx.reply('E`lon yuborildi!')
                        ctx.reply('E`lonlar tugagan bo`lsa bosh menuga o`ting  ?', Markup.inlineKeyboard([
                            [Markup.button.callback('Bosh menu', 'bosh_menu')]
                        ]))
                    }







                })
            }

        })
    } else {
        const Users = await User.find({
                idNumber: ctx.from.id
            })
            .select({ idNumber: 1 })
        if (Users.length >= 1) {

        } else {

            async function creatUser() {
                const user = new User({
                    name: ctx.from.first_name,
                    idNumber: ctx.from.id,
                    day: parseInt(date.getDate()),
                    month: parseInt(date.getMonth()) + 1


                })

                await user.save()
            }
            creatUser()
        }





        ctx.replyWithHTML(`Assalomu alaykum ${ctx.from.first_name}! botimizga xush kelibsiz! \n  Endi sizni ushbu bot,  har safar jamoat namozi vaqtlari o\`zgargani haqida xabardor qiladi!`)
        const photourl = await PhotoUrl.findById('61b5a7464f12aeb80d5ee100')
        photo = photourl.url
        let str = '🕓 Namoz vaqtlari!  ' + date.getDate() + ' - ' + month[date.getMonth()] + '  ' + date.getFullYear() + ' yil \n Payshanba vaqti bilan'
        await ctx.telegram.sendPhoto(ctx.from.id, photo)

        ctx.telegram.sendMessage(ctx.from.id, str, {
            reply_markup: {
                keyboard: [
                    ['Namoz vaqtlarini qayta yuklash'],

                    ['Statistika', 'Barcha botlar ro`yxati'],
                    ['Botni to`xtatish', 'Botni qayta ishga tushirish'],
                    ['Qalandarxona telegram guruhiga o`tish']


                ]
            }
        })
        let i = 0
        bot.on('message', async ctx => {


            let th = ''
            switch (ctx.message.text) {
                case 'Namoz vaqtlarini qayta yuklash':
                    await bot.telegram.sendPhoto(ctx.from.id, photo)
                    await bot.telegram.sendMessage(ctx.from.id, str);

                    break;

                case 'Botni qayta ishga tushirish':
                    ctx.reply('/start ni bosing!')
                    break;
                case 'Barcha botlar ro`yxati':
                    ctx.replyWithHTML('<b><i>1.</i></b> Payshanba: <b>@Qalandarxona_bot</b>');
                    break;
                case 'Botni to`xtatish':
                    await User.deleteOne({ idNumber: ctx.from.id })

                    ctx.replyWithHTML('<b><i>Bot to`xtatildi! endi bot sizga xabar yubormaydi.🥵</i> Botdan qayta foydalanish uchun uni qayta ishga tushiring /start!</b>')
                    break;

                case 'Qalandarxona telegram guruhiga o`tish':
                    ctx.reply('https://t.me/Qalandarxona_Jome_Masjidi')
                    break;
                case 'Statistika':
                    const Users = await User.find({})
                        .select({ idNumber: 1 })

                    const UsersDay = await User.find({
                            day: parseInt(date.getDate())
                        })
                        .select({ idNumber: 1 })

                    const UsersMonth = await User.find({
                            month: parseInt(date.getMonth()) + 1
                        })
                        .select({ idNumber: 1 })
                    const Layks = await Layk.findById('61b5737108dd84ef1697f680')

                    ctx.replyWithHTML(`Botdagi obunachilar: ${Users.length} \n\n Bugun qo\`shilgan obunachilar: ${UsersDay.length} ta \n Oxirgi 1 oyda qo\`shilgan obunachilar: ${25+parseInt(UsersMonth.length)} ta \n Bot ishga tushganiga ${Layks.layk} kun bo\`ldi \n\n @@Qalandarxona_bot statistikasi`)
                    break;





            }




        })

    }



})



















// bot.command(process.env.admin_command, async(ctx) => {



//     elon = true
//     await ctx.replyWithHTML(`<b>${ctx.from.first_name}</b> (Admin) hush kelibsiz! yo\`nalishni tanlang.`, Markup.inlineKeyboard([
//         [Markup.button.callback('Namoz vaqtlari', 'namoz'), Markup.button.callback('E`lon', 'elon')]
//     ]))







// })
// async function namoz(ctx) {


// }

// bot.action('namoz', async(ctx) => {
//     ctx.reply('Namoz vaqtlari o`zgargan bo`lsa, uning rasmini menga yuboring!')
//     console.log('photo1')
//     bot.on('photo', async ctx => {
//         console.log('photo2')
//         if (parseInt(ctx.from.id) === parseInt(process.env.admin_J) || parseInt(ctx.from.id) === parseInt(process.env.admin_G)) {
//             const photourl = await PhotoUrl.findById('61b5a7464f12aeb80d5ee100')
//             console.log('photo3')
//             photourl.url = ctx.message.photo[0].file_id
//             await photourl.save()
//             photo = photourl.url

//             ctx.reply('Rasm qabul qilindi!')
//             ctx.replyWithHTML('<b>Rasmni botdan foydalanuvchilarga yuborishni aniq istaysizmi ?</b>', Markup.inlineKeyboard([
//                 [Markup.button.callback('HA', 'photoSend')],
//                 [Markup.button.callback('Yo`q', 'photoNosend')]
//             ]))
//         }
//     })

//     await ctx.answerCbQuery()
// })

// bot.action('photoNosend', async ctx => {
//     ctx.reply('Namoz vaqtlari o`zgargan bo`lsa, uning rasmini menga yuboring!')
// })
// bot.action('elon', (ctx) => {

//     if (elon === true) {
//         ctx.reply('E`lonni yozing!')
//         bot.on('message', async ctx => {
//             console.log(ctx.from.id)
//             if (parseInt(ctx.from.id) === parseInt(process.env.admin_J) || parseInt(ctx.from.id) === parseInt(process.env.admin_G)) {
//                  ctx.telegram.sendMessage(process.env.chatID, ctx.message.text)
//                 ctx.reply('E`lonlar tugagan bo`lsa boshqa bo`limga o`ting', Markup.inlineKeyboard([
//                     [Markup.button.callback('E`lonlar tugagan bo`lsa bosh menu ga o`ting', 'bmenu')]
//                 ]))
//             }

//         })
//         ctx.answerCbQuery()
//     }

// })
// bot.action('photoSend', async(ctx) => {

// const Users = await User.find({
//})
//
//     .select({ idNumber: 1 })
// for (let user of Users) {
//     let str = 'Namoz vaqti o`zgardi! 📣🕙 ' + date.getDate() + ' - ' + month[date.getMonth()] + '  ' + date.getFullYear() + ' yil'

//     ctx.telegram.sendPhoto(user.idNumber, photo)
//     ctx.telegram.sendMessage(user.idNumber, str)

// }
//     const photourl = await PhotoUrl.findById('61b5a7464f12aeb80d5ee100')
//     photo = photourl.url

//     let str = date.getDate() + ' - ' + month[date.getMonth()] + '  ' + date.getFullYear() + 'Yil' +
//         '\n\n' + 'Namoz vaqtlari o`zgardi!  📣🕙 \n\n ' + ' Agar Botimiz sizni har safar namoz vaqtlari o`zgargani haqida o`zingizga xabar berishini istasangiz botga kiring 👇 \n\n @Qalandarxona_bot'

//     ctx.telegram.sendPhoto(process.env.chatID, photo)
//     ctx.telegram.sendMessage(process.env.chatID, str)

//     ctx.reply('Rasm, bot foydalanuvchilariga yuborildi!')
//     bot.on('photo', namoz)

//     ctx.reply('Bosh menuga qayting', Markup.inlineKeyboard([
//         [Markup.button.callback('Bosh menu', 'bmenu')]
//     ]))
//     await ctx.answerCbQuery()

// })

// bot.action('bmenu', async ctx => {
//     elon = false
//     ctx.reply('E`lon yuborish tugadi. bosh menuga o`tish uchun adminlik kodini kiriting')
// })

bot.launch()