import React, { useState } from 'react'
import PropTypes from 'prop-types'

const TextInput = (props) => {
    const { id, value, label } = props
    return (
        <div className="field">
            <input
                id={id}
                type="text"
                value={value}
                placeholder={label}
                onChange={props.onChange}
            />
        </div>
    )
}

TextInput.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    label: PropTypes.string,
    onChange: PropTypes.func,
}

export default TextInput
