const nodemailer = require('nodemailer')
require('dotenv').config()
const { billGenerator, billPdf } = require('../helpers/bill.generator')
const path = require('path');

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
      html: `<p>Gracias por registrarte en El Mercado <a href="http://localhost:3001/api/activate/${token}">Click</a> http://localhost:3001/api/activate/${token}</p>`
    })
}

module.exports.sendActivationEmailSupplier = (email, token) => {
  transporter
  .sendMail({
    from: `"El Mercado" <ines@el-mercado.es>`,
    to: email,
    subject: 'Activa tu cuenta de vendedor',
    text: `Gracias por registrarte en El Mercado como vendedor http://localhost:3001/api/vendor/activate/${token}`,
    html: `<p>Gracias por registrarte en El Mercado como vendedor <a href="http://localhost:3001/api/vendor/activate/${token}">Click</a> http://localhost:3001/api/vendor/activate/${token}</p>`
  })
}

module.exports.sendChangeEmail = (email, token) => {
  transporter
  .sendMail({
    from: `"El Mercado" <ines@el-mercado.es>`,
    to: email,
    subject: 'Cambia tu email',
    text: `Confirma tu nuevo correo electrónico en http://localhost:3001/api/activate-new-user-email/${token}`,
    html: `<p>Gracias por registrarte en El Mercado como vendedor <a href="http://localhost:3001/api/activate-new-user-email/${token}">Click</a> http://localhost:3001/api/activate-new-user-email/${token}</p>`
  })
}

module.exports.sendChangePassword = (email, token) => {
  transporter
  .sendMail({
    from: `"El Mercado" <ines@el-mercado.es>`,
    to: email,
    subject: 'Confirme su identidad',
    text: `Confirma tu nuevo correo electrónico en http://localhost:3001/api/activate-new-user-pass/${token}`,
    html: `<p>Gracias por registrarte en El Mercado como vendedor <a href="http://localhost:3001/api/activate-new-user-pass/${token}">Click</a> http://localhost:3001/api/activate-new-user-pass/${token}</p>`
  })
}

module.exports.sendSaleUser = async (email, cart, address, total) => {
  billPdf(cart, total)
  setTimeout(() => {
    transporter
    .sendMail({
      from: `"El Mercado" <ines@el-mercado.es>`,
      to: email,
      subject: 'Gracias por su compra',
      html: `<p>Gracias por su compra: </p>
      <ul>${billGenerator(cart)}</ul>
      <p>Total: ${total}€</p>
      <p>Dirección de entrega: ${address}</p>`,
      attachments: [ {
        filename: 'factura-el-mercado.pdf',
        path: path.join(__dirname, '../factura-el-mercado.pdf'),
        contentType: 'application/pdf'
      }]
    })
  }, 5000)
}

module.exports.sendSaleSupplier = (email, cart, total, address) => {
  transporter
  .sendMail({
    from: `"El Mercado" <ines@el-mercado.es>`,
    to: email,
    subject: 'Tiene un nuevo encargo',
    html: `<p><Envío a ${address}</p>
    <ul>${billGenerator(cart)}</ul>
    <p>Total: ${total}€</p>`
  })
}

module.exports.sendEmailUserFromSupp = (email, subject, message) => {
  transporter
  .sendMail({
    from: `"El Mercado" <ines@el-mercado.es>`,
    to: email,
    subject: `${subject}`,
    html: `<p>${message}</p>`
  })
}

module.exports.sendSaleDone = (email, supplier, products, urlReview) => {
  transporter
  .sendMail({
    from: `"El Mercado" <ines@el-mercado.es>`,
    to: email,
    subject: `Su pedido de ${supplier} ha sido entregado`,
    html: `<p>${products}<a href=${urlReview}>Opina sobre el pedido</a></p>`
  })
}