import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

class EditableField extends React.Component {
  render() {
    const tooltip = this.props.cellData.tooltip ? (
      <Tooltip id={`tooltip-${this.props.cellData.name}`}>
        {this.props.cellData.tooltip}
      </Tooltip>
    ) : null;

    const input = (
      <Form.Control
        className={`${this.props.cellData.textAlign} ${this.props.cellData.className || ''}`}
        type={this.props.cellData.type}
        placeholder={this.props.cellData.placeholder}
        min={this.props.cellData.min}
        name={this.props.cellData.name}
        id={this.props.cellData.id}
        value={this.props.cellData.value}
        step={this.props.cellData.step}
        precision={this.props.cellData.precision}
        aria-label={this.props.cellData.name}
        onChange={this.props.onItemizedItemEdit}
        required={this.props.cellData.required}
        disabled={this.props.cellData.disabled}
        style={this.props.cellData.style}
      />
    );

    return (
      <InputGroup className="my-1 flex-nowrap">
        {this.props.cellData.leading != null && (
          <InputGroup.Text className="bg-light fw-bold border-0 text-secondary px-2">
            <span 
              className="border border-2 border-secondary rounded-circle d-flex align-items-center justify-content-center small" 
              style={{width: '20px', height: '20px'}}
            >
              {this.props.cellData.leading}
            </span>
          </InputGroup.Text>
        )}
        {tooltip ? (
          <OverlayTrigger placement="top" overlay={tooltip}>
            {input}
          </OverlayTrigger>
        ) : (
          input
        )}
        {this.props.cellData.trailing && (
          <InputGroup.Text className="bg-light fw-bold border-0 text-secondary">
            {this.props.cellData.trailing}
          </InputGroup.Text>
        )}
      </InputGroup>
    );
  }
}

export default EditableField;