import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Modal } from "flowbite-react";
import React from "react";

export default function SelectBedTypeModal(props) {
    const onSelect = (e) => {
        props.setSelectedBedType(e.target.value.id);
        props.setBedTypeName(e.target.value.bed_type_name);
        props.setOpenModal(false);
    }
    return (
        <Modal show={props.openModal} dismissible onClose={() => props.setOpenModal(false)}>
            <Modal.Body>
                <FormControl fullWidth>
                    <InputLabel id="bed-type-label">Chọn loại giường</InputLabel>
                    <Select labelId="bed-type-label"
                        label="Chọn loại giường"
                        onChange={onSelect}
                        >
                            {props.bedType.map((value,key)=><MenuItem value={value} key={key}>{value.bed_type_name}</MenuItem>)}
                    </Select>
                </FormControl>
            </Modal.Body>
        </Modal>
    )
}