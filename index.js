const { Telegraf, Markup } = require('telegraf')
require('dotenv').config()
let photo = ''
let tk = 0
let elon = false
let key = ''
const date = new Date()
const CronJob = require('cron').CronJob
const moment = require('moment-timezone');


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






const job = new CronJob('00 13 * * *', async() => {
    const photourl = await PhotoUrl.findById('61b5a7464f12aeb80d5ee100')
    photo = photourl.url

    let stra = '🕰 Namoz vaqtlari!  ' + moment().tz("Asia/Tashkent").format('D') + ' - ' + month[moment().tz("Asia/Tashkent").format('MM') - 1] + '  ' + moment().tz("Asia/Tashkent").format('YYYY') + '-yil \n\n Botimizdan to`liq foydalanish uchun quyidagi havolaga kiring \n @Qalandarxona_bot '
    await bot.telegram.sendPhoto(process.env.guruh_id, photo)
    await bot.telegram.sendMessage(process.env.guruh_id, stra)
}, null, true)
job.start()

const time = new CronJob('00 19 * * *', async() => {
    const Layks = await Layk.findById('61b5737108dd84ef1697f680')
    Layks.layk = Layks.layk + 1
    await Layks.save()
}, null, true)
time.start()


bot.command('/start@Qalandarxona_bot', async(ctx) => {

        ctx.telegram.sendMessage(ctx.from.id, 'Assalomu alaykum! botdan foydalanish uchun /start ni bosing!').catch((err) => {
            ctx.telegram.sendMessage(ctx.from.id, 'Siz botni bloklab qo`ygansiz, botni blokdan chiqaring!').catch((err) => {

            })
        })
    }

)

bot.start(async(ctx) => {

    if (parseInt(ctx.from.id) === parseInt(process.env.admin_J) || parseInt(ctx.from.id) === parseInt(process.env.admin_G)) {
        await ctx.reply(`Assalomu alaykum ! ${ctx.from.first_name}`, { reply_markup: { remove_keyboard: true } })
        ctx.reply('Tanlang!', Markup.inlineKeyboard([
            [Markup.button.callback('admin', 'admin'), Markup.button.callback('client', 'client')]
        ]))


        bot.action('admin', async ctx => {
            key = process.env.admin_key


            await ctx.replyWithHTML(`<b>${ctx.from.first_name}</b> (Admin) hush kelibsiz! `)
            await ctx.answerCbQuery()



            ctx.reply('E`lonni yoki namoz vaqtlarini yuboring!', Markup.inlineKeyboard([
                [Markup.button.callback('Bosh menu', 'bosh_menu')]
            ]))

            bot.on('text', async ctx => {
                console.log(key)
                if ((parseInt(ctx.from.id) === parseInt(process.env.admin_J) || parseInt(ctx.from.id) === parseInt(process.env.admin_G)) && key === 'admin') {
                    ctx.telegram.sendMessage(process.env.guruh_id, ctx.message.text).catch((err) => {

                    })
                    const Users = await User.find({})

                    .select({ idNumber: 1 })
                    for (let user of Users) {
                        ctx.telegram.sendMessage(user.idNumber, ctx.message.text).catch((err) => {

                        })


                    }


                    ctx.reply('E`lon yuborildi!')
                    ctx.reply('E`lonlar tugagan bo`lsa bosh menuga o`ting  ?', Markup.inlineKeyboard([
                        [Markup.button.callback('Bosh menu', 'bosh_menu')]
                    ]))
                } else {
                    if (key === 'client') {
                        const photourl = await PhotoUrl.findById('61b5a7464f12aeb80d5ee100')
                        photo = photourl.url
                        let str = '🕰 Namoz vaqtlari!  ' + moment().tz("Asia/Tashkent").format('D') + ' - ' + month[moment().tz("Asia/Tashkent").format('MM') - 1] + '  ' + moment().tz("Asia/Tashkent").format('YYYY') + '-yil'

                        let i = 0



                        let th = ''
                        switch (ctx.message.text) {

                            case '🔄Namoz vaqtlarini qayta yuklash':
                                await bot.telegram.sendPhoto(ctx.from.id, photo)
                                await bot.telegram.sendMessage(ctx.from.id, str);

                                break;

                            case '⛏Botni qayta ishga tushirish':
                                ctx.reply('/start ni bosing!')
                                break;
                            case '📄Barcha botlar ro`yxati':
                                ctx.replyWithHTML('<b><i>1.</i></b> Payshanba: <b>@Qalandarxona_bot</b>');
                                break;
                            case '❌Botni to`xtatish':
                                await User.deleteOne({ idNumber: ctx.from.id })

                                ctx.replyWithHTML('<b><i>Bot to`xtatildi! endi bot sizga xabar yubormaydi.🥵</i> Botdan qayta foydalanish uchun uni qayta ishga tushiring /start!</b>')
                                break;

                            case '🚀Qalandarxona telegram guruhiga o`tish':
                                ctx.reply('https://t.me/Qalandarxona_Jome_Masjidi')
                                break;
                            case '📈Statistika':
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

                                ctx.replyWithHTML(`👩‍👦‍👦Bot foydalanuvchilari: ${Users.length} \n\n 👩‍⚖️Bugun qo\`shilgan obunachilar: ${UsersDay.length} ta \n 👷Oxirgi 1 oyda qo\`shilgan obunachilar: ${25+parseInt(UsersMonth.length)} ta \n 🎰Bot ishga tushganiga ${Layks.layk} kun bo\`ldi \n\n @Qalandarxona_bot Statistikasi`)
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

                    await ctx.reply('Rasm qabul qilindi!')
                    ctx.replyWithHTML('<b>Rasmni botdan foydalanuvchilarga yuborishni aniq istaysizmi ?</b>', Markup.inlineKeyboard([
                        [Markup.button.callback('HA', 'photoSend')],
                        [Markup.button.callback('Yo`q', 'photoNosend')]
                    ]))
                }
            })
            ctx.answerCbQuery()




            bot.action('photoSend', async ctx => {

                let str = '📣🕙 Namoz vaqti o`zgardi! \n ' + moment().tz("Asia/Tashkent").format('D') + ' - ' + month[moment().tz("Asia/Tashkent").format('MM') - 1] + '  ' + moment().tz("Asia/Tashkent").format('YYYY') + '-yil \n\n Botimizdan to`liq foydalanish uchun quyidagi havolaga o`ting \n @Qalandarxona_bot'


                const Users = await User.find({})

                .select({ idNumber: 1 })
                for (let user of Users) {

                    await ctx.telegram.sendPhoto(user.idNumber, photo).catch((err) => {

                    })
                    ctx.telegram.sendMessage(user.idNumber, str).catch((err) => {

                    })

                }
                await ctx.telegram.sendPhoto(process.env.guruh_id, photo).catch((err) => {

                })
                ctx.telegram.sendMessage(process.env.guruh_id, str).catch((err) => {})


                ctx.reply('Namoz vaqti bot foydalanuvchilariga yuborildi!', Markup.inlineKeyboard([
                    [Markup.button.callback('Bosh menu', 'bosh_menu')]
                ]))




                await ctx.answerCbQuery()

            })

            bot.action('photoNosend', async ctx => {
                ctx.reply('E`lonni yoki namoz vaqtlarini yuboring!', Markup.inlineKeyboard([
                    [Markup.button.callback('Bosh menu', 'bosh_menu')]
                ]))
            })

        })
        bot.action('bosh_menu', async ctx => {
            key = process.env.client_key

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





                ctx.replyWithHTML(`Assalomu alaykum ${ctx.from.first_name}! botimizga xush kelibsiz! \n  Endi sizni ushbu bot,  har safar jamoat namozi vaqtlari o\`zgargani haqida xabardor qiladi!`).catch((err) => {
                    ctx.telegram.sendMessage(ctx.from.id, 'Siz botni bloklab qo`ygansiz, botni blokdan chiqaring!').catch((err) => {

                    })
                })
                const photourl = await PhotoUrl.findById('61b5a7464f12aeb80d5ee100')
                photo = photourl.url
                let str = '🕰 Namoz vaqtlari!  ' + moment().tz("Asia/Tashkent").format('D') + ' - ' + month[moment().tz("Asia/Tashkent").format('MM') - 1] + '  ' + moment().tz("Asia/Tashkent").format('YYYY') + '-yil'
                await ctx.telegram.sendPhoto(ctx.from.id, photo)
                if (key === 'client') {
                    ctx.telegram.sendMessage(ctx.from.id, str, {
                        reply_markup: {
                            keyboard: [
                                ['🔄Namoz vaqtlarini qayta yuklash'],

                                ['📈Statistika', '📄Barcha botlar ro`yxati'],
                                ['❌Botni to`xtatish', '⛏Botni qayta ishga tushirish'],
                                ['🚀Qalandarxona telegram guruhiga o`tish']


                            ]
                        }
                    })
                }

                let i = 0
                bot.on('message', async ctx => {
                    if (key === 'client') {
                        let th = ''
                        switch (ctx.message.text) {

                            case '🔄Namoz vaqtlarini qayta yuklash':
                                await bot.telegram.sendPhoto(ctx.from.id, photo)
                                await bot.telegram.sendMessage(ctx.from.id, str);

                                break;

                            case '⛏Botni qayta ishga tushirish':
                                ctx.reply('/start ni bosing!')
                                break;
                            case '📄Barcha botlar ro`yxati':
                                ctx.replyWithHTML('<b><i>1.</i></b> Payshanba: <b>@Qalandarxona_bot</b>');
                                break;
                            case '❌Botni to`xtatish':
                                await User.deleteOne({ idNumber: ctx.from.id })

                                ctx.replyWithHTML('<b><i>Bot to`xtatildi! endi bot sizga xabar yubormaydi.🥵</i> Botdan qayta foydalanish uchun uni qayta ishga tushiring /start!</b>')
                                break;

                            case '🚀Qalandarxona telegram guruhiga o`tish':
                                ctx.reply('https://t.me/Qalandarxona_Jome_Masjidi')
                                break;
                            case '📈Statistika':
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

                                ctx.replyWithHTML(`👩‍👦‍👦Bot foydalanuvchilari: ${Users.length} \n\n 👩‍⚖️Bugun qo\`shilgan obunachilar: ${UsersDay.length} ta \n 👷Oxirgi 1 oyda qo\`shilgan obunachilar: ${25+parseInt(UsersMonth.length)} ta \n 🎰Bot ishga tushganiga ${Layks.layk} kun bo\`ldi \n\n @Qalandarxona_bot Statistikasi`)
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
        let str = '🕰 Namoz vaqtlari!  ' + moment().tz("Asia/Tashkent").format('D') + ' - ' + month[moment().tz("Asia/Tashkent").format('MM') - 1] + '  ' + moment().tz("Asia/Tashkent").format('YYYY') + '-yil'
        await ctx.telegram.sendPhoto(ctx.from.id, photo)

        ctx.telegram.sendMessage(ctx.from.id, str, {
            reply_markup: {
                keyboard: [
                    ['🔄Namoz vaqtlarini qayta yuklash'],

                    ['📈Statistika', '📄Barcha botlar ro`yxati'],
                    ['❌Botni to`xtatish', '⛏Botni qayta ishga tushirish'],
                    ['🚀Qalandarxona telegram guruhiga o`tish']


                ]
            }
        })
        let i = 0
        bot.on('message', async ctx => {


            let th = ''
            switch (ctx.message.text) {

                case '🔄Namoz vaqtlarini qayta yuklash':
                    await bot.telegram.sendPhoto(ctx.from.id, photo)
                    await bot.telegram.sendMessage(ctx.from.id, str);

                    break;

                case '⛏Botni qayta ishga tushirish':
                    ctx.reply('/start ni bosing!')
                    break;
                case '📄Barcha botlar ro`yxati':
                    ctx.replyWithHTML('<b><i>1.</i></b> Payshanba: <b>@Qalandarxona_bot</b>');
                    break;
                case '❌Botni to`xtatish':
                    await User.deleteOne({ idNumber: ctx.from.id })

                    ctx.replyWithHTML('<b><i>Bot to`xtatildi! endi bot sizga xabar yubormaydi.🥵</i> Botdan qayta foydalanish uchun uni qayta ishga tushiring /start!</b>')
                    break;

                case '🚀Qalandarxona telegram guruhiga o`tish':
                    ctx.reply('https://t.me/Qalandarxona_Jome_Masjidi')
                    break;
                case '📈Statistika':
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

                    ctx.replyWithHTML(`👩‍👦‍👦Bot foydalanuvchilari: ${Users.length} \n\n 👩‍⚖️Bugun qo\`shilgan obunachilar: ${UsersDay.length} ta \n 👷Oxirgi 1 oyda qo\`shilgan obunachilar: ${25+parseInt(UsersMonth.length)} ta \n 🎰Bot ishga tushganiga ${Layks.layk} kun bo\`ldi \n\n @Qalandarxona_bot Statistikasi`)
                    break;





            }




        })

    }



})


bot.launch()