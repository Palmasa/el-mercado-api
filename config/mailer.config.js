const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: '1und1',
    auth: {
        user: process.env.NM_USER,
        pass: process.env.NM_PASSWORD,
    },
})

transporter.verify(function (error, success) {
    if (error) {
        console.log(error)
    } else {
        console.log('Nodemailer is ready!')
    }
})

module.exports.sendActivationEmail = (email, token) => {
  transporter
    .sendMail({
      from: `"El Mercado" <ines@el-mercado.es>`,
      to: email,
      subject: 'Activa tu cuenta',
      text: `Gracias por registrarte en El Mercado http://localhost:3001/api/activate/${token}`,
      html: `<p>Gracias por registrarte en El Mercado <a href="http://localhost:3001/api/activate/${token}">Click</a> http://localhost:/activate/${token}</p>`
    })
}

module.exports.sendActivationEmailSupplier = (email, token) => {
  transporter
  .sendMail({
    from: `"El Mercado" <ines@el-mercado.es>`,
    to: email,
    subject: 'Activa tu cuenta de vendedor',
    text: `Gracias por registrarte en El Mercado como vendedor http://localhost:3001/api/activate/${token}`,
    html: `<p>Gracias por registrarte en El Mercado como vendedor <a href="http://localhost:3001/api/activate/${token}">Click</a> http://localhost:/activate/${token}</p>`
  })
}