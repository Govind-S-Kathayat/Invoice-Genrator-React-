import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { BiPaperPlane, BiCloudDownload } from "react-icons/bi";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

class InvoiceModal extends React.Component {
  generatePDF = () => {
    const { currency, total, amountPaid, balanceDue } = this.props;
    html2canvas(document.querySelector("#invoiceCapture")).then((canvas) => {
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: [612, 792]
      });
      pdf.internal.scaleFactor = 1;
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice-${this.props.info.invoiceNumber}.pdf`);
    });
  };

  render() {
    const { 
      showModal, closeModal, info, items, currency, 
      subTotal, taxAmount, discountAmount, total,
      amountPaid, balanceDue, paymentStatus
    } = this.props;

    return (
      <Modal show={showModal} onHide={closeModal} size="lg" centered>
        <div id="invoiceCapture">
          <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
            <div className="w-100">
              <h4 className="fw-bold my-2">{info.billFrom || 'Your Company Name'}</h4>
              <h6 className="fw-bold text-secondary mb-1">
                Invoice #: {info.invoiceNumber || ''}
              </h6>
            </div>
            <div className="text-end ms-4">
              <h6 className="fw-bold mt-1 mb-2">Amount&nbsp;Due:</h6>
              <h5 className="fw-bold text-secondary">
                {currency} {balanceDue}
              </h5>
            </div>
          </div>
          <div className="p-4">
            <Row className="mb-4">
              <Col md={4}>
                <div className="fw-bold">Billed to:</div>
                <div>{info.billTo || ''}</div>
                <div>{info.billToAddress || ''}</div>
                <div>{info.billToEmail || ''}</div>
              </Col>
              <Col md={4}>
                <div className="fw-bold">Billed From:</div>
                <div>{info.billFrom || ''}</div>
                <div>{info.billFromAddress || ''}</div>
                <div>{info.billFromEmail || ''}</div>
              </Col>
              <Col md={4}>
                <div className="fw-bold mt-2">Issue Date:</div>
                <div>{info.issueDate || ''}</div>
                <div className="fw-bold mt-2">Due Date:</div>
                <div>{info.dueDate || ''}</div>
                <div className="fw-bold mt-2">Payment Status:</div>
                <span className={`badge ${
                  paymentStatus === 'paid' ? 'bg-success' : 
                  paymentStatus === 'partial' ? 'bg-warning' : 'bg-danger'
                }`}>
                  {paymentStatus.toUpperCase()}
                </span>
              </Col>
            </Row>
            
            <Table className="mb-0">
              <thead>
                <tr>
                  <th>ITEM</th>
                  <th>QTY</th>
                  <th className="text-end">PRICE</th>
                  <th className="text-end">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i}>
                    <td>
                      {item.name} - {item.description}
                    </td>
                    <td>{item.quantity}</td>
                    <td className="text-end">{currency} {item.price}</td>
                    <td className="text-end">{currency} {(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Table>
              <tbody>
                <tr className="text-end">
                  <td colSpan="3" className="fw-bold">SUBTOTAL</td>
                  <td className="text-end">{currency} {subTotal}</td>
                </tr>
                {taxAmount != 0.00 && (
                  <tr className="text-end">
                    <td colSpan="3" className="fw-bold">TAX</td>
                    <td className="text-end">{currency} {taxAmount}</td>
                  </tr>
                )}
                {discountAmount != 0.00 && (
                  <tr className="text-end">
                    <td colSpan="3" className="fw-bold">DISCOUNT</td>
                    <td className="text-end">{currency} {discountAmount}</td>
                  </tr>
                )}
                <tr className="text-end">
                  <td colSpan="3" className="fw-bold">TOTAL</td>
                  <td className="text-end">{currency} {total}</td>
                </tr>
                <tr className="text-end">
                  <td colSpan="3" className="fw-bold">AMOUNT PAID</td>
                  <td className="text-end">{currency} {amountPaid}</td>
                </tr>
                <tr className="text-end fw-bold fs-5">
                  <td colSpan="3">BALANCE DUE</td>
                  <td className={`text-end ${
                    parseFloat(balanceDue) > 0 ? 'text-danger' : 'text-success'
                  }`}>
                    {currency} {balanceDue}
                  </td>
                </tr>
              </tbody>
            </Table>

            {info.notes && (
              <div className="bg-light py-3 px-4 rounded">
                {info.notes}
              </div>
            )}
          </div>
        </div>
        <div className="pb-4 px-4">
          <Row>
            <Col md={6}>
              <Button variant="primary" className="d-block w-100" onClick={this.generatePDF}>
                <BiPaperPlane className="me-2"/>Send Invoice
              </Button>
            </Col>
            <Col md={6}>
              <Button variant="outline-primary" className="d-block w-100 mt-3 mt-md-0" onClick={this.generatePDF}>
                <BiCloudDownload className="me-2"/>
                Download Copy
              </Button>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}

export default InvoiceModal;