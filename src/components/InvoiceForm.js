import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import InvoiceItem from './InvoiceItem';
import InvoiceModal from './InvoiceModal';
import InputGroup from 'react-bootstrap/InputGroup';
import { BsInfoCircle, BsFileText } from 'react-icons/bs';

class InvoiceForm extends React.Component {
  constructor(props) {
    super(props);
    const currentDate = new Date().toISOString().split('T')[0];
    this.state = {
      isOpen: false,
      currency: '$',
      currentDate,
      invoiceNumber: this.generateInvoiceNumber(),
      issueDate: currentDate,
      dueDate: currentDate,
      billTo: '',
      billToEmail: '',
      billToAddress: '',
      billFrom: 'Your Company Name',
      billFromEmail: 'billing@yourcompany.com',
      billFromAddress: '123 Main St, City, Country',
      notes: 'Thank you for your business!',
      total: '0.00',
      subTotal: '0.00',
      taxRate: '0',
      taxAmount: '0.00',
      discountRate: '0',
      discountAmount: '0.00',
      amountPaid: '0.00',
      paymentStatus: 'unpaid',
      items: [
        {
          id: this.generateId(),
          name: '',
          description: '',
          price: '1.00',
          quantity: 1
        }
      ]
    };
  }

  generateId = () => (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  
  generateInvoiceNumber = () => {
    const prefix = 'INV';
    const randomNum = Math.floor(Math.random() * 90000) + 10000;
    return `${prefix}-${randomNum}`;
  };

  componentDidMount() {
    this.handleCalculateTotal();
  }

  handleRowDel = (itemToDelete) => {
    if (this.state.items.length <= 1) {
      alert('You must have at least one item');
      return;
    }
    this.setState(prevState => ({
      items: prevState.items.filter(item => item.id !== itemToDelete.id)
    }), this.handleCalculateTotal);
  };

  handleAddEvent = () => {
    this.setState(prevState => ({
      items: [
        ...prevState.items,
        {
          id: this.generateId(),
          name: '',
          description: '',
          price: '1.00',
          quantity: 1
        }
      ]
    }));
  };

  handleCalculateTotal = () => {
    const { items, taxRate, discountRate, amountPaid } = this.state;
    let subTotal = 0;

    items.forEach(item => {
      subTotal += parseFloat(item.price || 0) * parseInt(item.quantity || 0);
    });

    subTotal = parseFloat(subTotal).toFixed(2);
    const taxAmount = parseFloat(subTotal * (taxRate / 100)).toFixed(2);
    const discountAmount = parseFloat(subTotal * (discountRate / 100)).toFixed(2);
    const total = (parseFloat(subTotal) - parseFloat(discountAmount) + parseFloat(taxAmount)).toFixed(2);
    
    let paymentStatus = 'unpaid';
    const paidAmount = parseFloat(amountPaid) || 0;
    if (paidAmount > 0) {
      paymentStatus = paidAmount >= parseFloat(total) ? 'paid' : 'partial';
    }

    this.setState({
      subTotal,
      taxAmount,
      discountAmount,
      total,
      paymentStatus
    });
  };

  onItemizedItemEdit = (evt) => {
    const { id, name, value } = evt.target;
    this.setState(prevState => ({
      items: prevState.items.map(item => 
        item.id === id ? { ...item, [name]: value } : item
      )
    }), this.handleCalculateTotal);
  };

  editField = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value }, this.handleCalculateTotal);
  };

  onCurrencyChange = (event) => {
    this.setState({ currency: event.target.value }, this.handleCalculateTotal);
  };

  openModal = (event) => {
    event.preventDefault();
    
    // Validate required fields
    const requiredFields = [
      'issueDate', 'dueDate', 'billTo', 'billToEmail', 
      'billToAddress', 'billFrom', 'billFromEmail', 'billFromAddress'
    ];
    
    const missingFields = requiredFields.filter(field => !this.state[field]);
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Validate items
    const invalidItems = this.state.items.some(item => !item.name || !item.price || !item.quantity);
    if (invalidItems) {
      alert('Please fill all item fields (name, price, quantity) before reviewing');
      return;
    }

    // Ensure calculations are up to date
    this.handleCalculateTotal();
    this.setState({ isOpen: true });
  };

  closeModal = () => this.setState({ isOpen: false });

  markAsPaid = () => {
    this.setState(prevState => ({
      amountPaid: prevState.total,
      paymentStatus: 'paid'
    }), this.handleCalculateTotal);
  };

  render() {
    const { 
      currency, invoiceNumber, issueDate, dueDate,
      billTo, billToEmail, billToAddress, billFrom, billFromEmail, 
      billFromAddress, notes, subTotal, taxRate, taxAmount, 
      discountRate, discountAmount, total, amountPaid, paymentStatus,
      isOpen
    } = this.state;

    const balanceDue = (parseFloat(total) - parseFloat(amountPaid)).toFixed(2);

    return (
      <Form onSubmit={this.openModal}>
        <Row>
          <Col md={8} lg={9}>
            <Card className="p-4 p-xl-5 my-3 my-xl-4 shadow-sm">
              <div className="d-flex flex-row align-items-start justify-content-between mb-4">
                <div className="d-flex flex-column">
                  <div className="d-flex align-items-center mb-2">
                    <span className="fw-bold me-2">Status:</span>
                    <span className={`badge ${
                      paymentStatus === 'paid' ? 'bg-success' : 
                      paymentStatus === 'partial' ? 'bg-warning' : 'bg-danger'
                    }`}>
                      {paymentStatus.toUpperCase()}
                    </span>
                  </div>
                  <div className="d-flex flex-row align-items-center mb-2">
                    <span className="fw-bold me-2">Issue Date:</span>
                    <Form.Control 
                      type="date" 
                      value={issueDate} 
                      name="issueDate"
                      onChange={this.editField}
                      style={{ maxWidth: '150px' }}
                      required
                    />
                  </div>
                  <div className="d-flex flex-row align-items-center">
                    <span className="fw-bold me-2">Due Date:</span>
                    <Form.Control 
                      type="date" 
                      value={dueDate} 
                      name="dueDate" 
                      onChange={this.editField}
                      style={{ maxWidth: '150px' }}
                      required
                    />
                  </div>
                </div>
                <div className="d-flex flex-column text-end">
                  <h4 className="fw-bold text-primary">INVOICE</h4>
                  <div className="d-flex flex-row align-items-center justify-content-end">
                    <span className="fw-bold me-2">#</span>
                    <Form.Control
                      type="text"
                      value={invoiceNumber}
                      name="invoiceNumber"
                      onChange={this.editField}
                      style={{ maxWidth: '150px' }}
                      required
                    />
                  </div>
                </div>
              </div>

              <hr className="my-4" />

              <Row className="mb-5 g-3">
                <Col md={6}>
                  <div className="bg-light p-3 rounded">
                    <Form.Label className="fw-bold d-flex align-items-center">
                      <BsInfoCircle className="me-2" /> Bill to:
                    </Form.Label>
                    <Form.Control
                      placeholder="Client/Company Name"
                      value={billTo}
                      name="billTo"
                      onChange={this.editField}
                      className="my-2"
                      required
                    />
                    <Form.Control
                      placeholder="Email address"
                      value={billToEmail}
                      name="billToEmail"
                      type="email"
                      onChange={this.editField}
                      className="my-2"
                      required
                    />
                    <Form.Control
                      as="textarea"
                      placeholder="Billing address"
                      value={billToAddress}
                      name="billToAddress"
                      onChange={this.editField}
                      className="my-2"
                      rows={3}
                      required
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="bg-light p-3 rounded">
                    <Form.Label className="fw-bold d-flex align-items-center">
                      <BsInfoCircle className="me-2" /> Bill from:
                    </Form.Label>
                    <Form.Control
                      placeholder="Your Company Name"
                      value={billFrom}
                      name="billFrom"
                      onChange={this.editField}
                      className="my-2"
                      required
                    />
                    <Form.Control
                      placeholder="Email address"
                      value={billFromEmail}
                      name="billFromEmail"
                      type="email"
                      onChange={this.editField}
                      className="my-2"
                      required
                    />
                    <Form.Control
                      as="textarea"
                      placeholder="Billing address"
                      value={billFromAddress}
                      name="billFromAddress"
                      onChange={this.editField}
                      className="my-2"
                      rows={3}
                      required
                    />
                  </div>
                </Col>
              </Row>

              <InvoiceItem 
                onItemizedItemEdit={this.onItemizedItemEdit}
                onRowAdd={this.handleAddEvent}
                onRowDel={this.handleRowDel}
                currency={currency}
                items={this.state.items}
              />

              <Row className="mt-4 justify-content-end">
                <Col lg={6}>
                  <div className="bg-light p-3 rounded">
                    <div className="d-flex flex-row align-items-start justify-content-between">
                      <span className="fw-bold">Subtotal:</span>
                      <span>{currency}{subTotal}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                      <span className="fw-bold">Discount:</span>
                      <span>
                        <span className="small">({discountRate || 0}%)</span>
                        {currency}{discountAmount || '0.00'}
                      </span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                      <span className="fw-bold">Tax:</span>
                      <span>
                        <span className="small">({taxRate || 0}%)</span>
                        {currency}{taxAmount || '0.00'}
                      </span>
                    </div>
                    <hr />
                    <div className="d-flex flex-row align-items-start justify-content-between fw-bold fs-5">
                      <span>Total:</span>
                      <span className="text-primary">{currency}{total || '0.00'}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between mt-3">
                      <span className="fw-bold">Amount Paid:</span>
                      <InputGroup className="w-auto">
                        <InputGroup.Text>{currency}</InputGroup.Text>
                        <Form.Control
                          type="number"
                          name="amountPaid"
                          value={amountPaid}
                          onChange={this.editField}
                          min="0"
                          step="0.01"
                          max={total}
                          style={{ maxWidth: '100px' }}
                        />
                      </InputGroup>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between mt-2 fw-bold">
                      <span>Balance Due:</span>
                      <span className={balanceDue > 0 ? 'text-danger' : 'text-success'}>
                        {currency}{balanceDue}
                      </span>
                    </div>
                  </div>
                </Col>
              </Row>

              <hr className="my-4" />

              <Form.Group>
                <Form.Label className="fw-bold d-flex align-items-center">
                  <BsInfoCircle className="me-2" /> Notes:
                </Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Additional notes"
                  name="notes"
                  value={notes}
                  onChange={this.editField}
                  rows={3}
                />
                <Form.Text className="text-muted">
                  This will appear at the bottom of the invoice.
                </Form.Text>
              </Form.Group>
            </Card>
          </Col>

          <Col md={4} lg={3}>
            <div className="sticky-top pt-md-3 pt-xl-4">
              <div className="d-grid gap-2 mb-4">
                <Button variant="primary" type="submit" className="d-flex align-items-center justify-content-center">
                  <BsFileText className="me-2" /> Review Invoice
                </Button>
                <Button 
                  variant="outline-success" 
                  onClick={this.markAsPaid}
                  className="d-flex align-items-center justify-content-center"
                >
                  <span className="me-2">✓</span> Mark as Paid
                </Button>
              </div>

              {isOpen && (
                <InvoiceModal 
                  showModal={isOpen} 
                  closeModal={this.closeModal} 
                  info={this.state} 
                  items={this.state.items} 
                  currency={currency} 
                  subTotal={subTotal} 
                  taxAmount={taxAmount} 
                  discountAmount={discountAmount} 
                  total={total}
                  amountPaid={amountPaid}
                  balanceDue={balanceDue}
                  paymentStatus={paymentStatus}
                />
              )}

              <Card className="mb-3">
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Currency</Form.Label>
                    <Form.Select 
                      onChange={this.onCurrencyChange} 
                      value={currency}
                      className="form-select-sm"
                    >
                      <option value="$">USD ($)</option>
                      <option value="€">EUR (€)</option>
                      <option value="£">GBP (£)</option>
                      <option value="¥">JPY (¥)</option>
                      <option value="₹">INR (₹)</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Tax Rate (%)</Form.Label>
                    <InputGroup>
                      <Form.Control
                        name="taxRate"
                        type="number"
                        value={taxRate}
                        onChange={this.editField}
                        placeholder="0.0"
                        min="0.00"
                        step="0.01"
                        max="100.00"
                      />
                      <InputGroup.Text>%</InputGroup.Text>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label className="fw-bold">Discount Rate (%)</Form.Label>
                    <InputGroup>
                      <Form.Control
                        name="discountRate"
                        type="number"
                        value={discountRate}
                        onChange={this.editField}
                        placeholder="0.0"
                        min="0.00"
                        step="0.01"
                        max="100.00"
                      />
                      <InputGroup.Text>%</InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default InvoiceForm;