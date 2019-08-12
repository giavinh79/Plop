import React from "react"
import "antd/dist/antd.css"
import { Slider, InputNumber, Row, Col } from "antd"

export default class MemberSlider extends React.Component {
    state = {
        inputValue: 1
    };

    onChange = value => {
        this.setState({
        inputValue: value
        });
    };

    render() {
        const { inputValue } = this.state;
        return (
        <Row>
            <Col span={12}>
            <Slider
                min={4}
                max={12}
                onChange={this.onChange}
                value={typeof inputValue === "number" ? inputValue : 0}
            />
            </Col>
            <Col span={4}>
            <InputNumber
                min={4}
                max={12}
                style={{ marginLeft: 16 }}
                value={inputValue}
                onChange={this.onChange}
            />
            </Col>
        </Row>
        );
    }
}