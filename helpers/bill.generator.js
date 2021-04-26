const { removeDuplicates } = require('./removeDuplicates')
const fs = require('fs');
const PDFDocument = require('./tables-pdf');

module.exports.billGenerator = (products) => {
  let allProducts = []
  let suppliers = []

  products.map((p) => suppliers.push(p.supplierId))
  let suppliersFiltered = removeDuplicates(suppliers)

  for (let i = 0; i < suppliersFiltered.length; i++) {
    let saleProducts = products
    .filter((product) => (product.supplierId).toString() ===  (suppliersFiltered[i]).toString())
    allProducts.push(`<p>${saleProducts[0].supplier} - Precio de envío: ${saleProducts[0].sendPrice}€</p>`)
    saleProducts.forEach((p) => {
      allProducts.push(`<li>${p.name} - ${p.price}€ - x0${p.quantity} - ${p.quantity * p.price}</li>`)
    })

  }

  return allProducts
}

module.exports.billPdf = (products, total, promo) => {
  let suppliers = []
  products.map((p) => suppliers.push(p.supplierId))
  let suppliersFiltered = removeDuplicates(suppliers)

  let pdfDoc = new PDFDocument();
  pdfDoc.pipe(fs.createWriteStream(`factura-el-mercado.pdf`));

  pdfDoc.fontSize(20)
  pdfDoc.text("El Mercado", { align: 'center'})
  pdfDoc.fontSize(10)
  pdfDoc.text("www.el-mercado.es", { align: 'center'})
  pdfDoc.moveDown(2);
  const table = {
    headers: ['Producto', 'Proveedor', 'Cantidad', 'Precio' ],
    rows: []
  }

  for (let i = 0; i < suppliersFiltered.length; i++) {
    let saleProducts = products.filter((product) => (product.supplierId).toString() ===  (suppliersFiltered[i]).toString())
    saleProducts.forEach((p) => {
      table.rows.push([p.name, p.supplier, `x0${p.quantity}`, `${p.quantity * p.price}€`])
    })
    table.rows.push([`Envío de ${saleProducts[0].supplier}`, '', '', `${saleProducts[0].sendPrice}€`])
    pdfDoc.moveDown(0.5);
  }
  if (promo) {
    table.rows.push(['Total', '', '', `${promo + total}€`])
    table.rows.push(['Código de descuento', '', '', `-${promo}€`])
  }
  pdfDoc.moveDown(1);
  table.rows.push(['Coste total', '', '', `${total}€`])
  pdfDoc.table(table, {
    prepareHeader: () => pdfDoc.font('Helvetica-Bold'),
    prepareRow: (row, i) => pdfDoc.font('Helvetica').fontSize(8)
  });
  pdfDoc.moveDown(4);
  pdfDoc.text("Gracias por realizar su compra con nosotros.")
  pdfDoc.moveDown(1);
  pdfDoc.text("Atentamente,")
  pdfDoc.moveDown(1.5);
  pdfDoc.text("El equipo El Mercado", { oblique: true })
  pdfDoc.end();

  return pdfDoc
}