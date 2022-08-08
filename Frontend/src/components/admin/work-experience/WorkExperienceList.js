
import React, { useState, useEffect } from "react";


// COMPONENTS
import { TableWorkExperience } from "./TableWorkExperience";
import { MessageServer } from "../../UI/MessageServer";
import { LoadingComponent } from "../../UI/LoadingComponent";
import { FormCreateAndUpdateWorkExperience } from "./FormCreateAndUpdateWorkExperience";
import { ModalUpdateAndCreate } from "../../UI/ModalUpdateAndCreate";

// BOOTSTRAP
import Container from "react-bootstrap/esm/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

// FILE EXTERNAL
import { endpointConsumeWithToken } from "../../../HELPERS/endpointConsume";


const WorkExperienceList = () => {


    // DATA FROM API
    const [useWorkExperienceData, setWorkExperienceData] = useState([]);
    const [useLoadWorkExperienceData, setLoadWorkExperienceData] = useState(true);

    // RENDER PAGE AGAIN
    const [useRenderPage, setRenderPage] = useState();


    // MODAL
    const [useIsOpenModal, setIsOpenModal] = useState(false);
    const [useModalTitle, setModalTitle] = useState("");
    const [useModalContentBody, setModalContentBody] = useState(null);


    useEffect(() => {

        setRenderPage(false);

        endpointConsumeWithToken("/work-experience/list-admin", true).then((data) => {
            // console.log(data);
            setLoadWorkExperienceData(false);
            setWorkExperienceData(data);
        });


    }, [useRenderPage]);


    const onCloseModal = () => {
        setIsOpenModal(false);
    }


    const onModalAddData = () => {

        setIsOpenModal(true);
        setModalTitle("Add Experience");
        setModalContentBody(<FormCreateAndUpdateWorkExperience setRenderPage={setRenderPage} setIsOpenModal={setIsOpenModal} />);
    }

    const onDeleteData = (id_data) => {

        endpointConsumeWithToken(`/work-experience/remove/${id_data}`, true, "DELETE").then((data) => {
            // console.log(data);
            setRenderPage(true);
        });

    }

    const onGetToUpdateData = (data_record) => {

        setIsOpenModal(true);
        setModalTitle(`Edit ${data_record.title_job}.`);
        setModalContentBody(<FormCreateAndUpdateWorkExperience data_record={data_record} setRenderPage={setRenderPage} setIsOpenModal={setIsOpenModal} />);

    }

    return (

        <>

            <Container className="mt-5 mb-5">
                <Row>

                    {/* Work Experience */}
                    <Col md={8} className="mx-auto">
                        <div className="mt-3 mb-3 text-end">
                            <Button onClick={() => onModalAddData()} className="btn_create_data" onMouseDown={(e) => e.preventDefault()}>Add</Button>{' '}
                        </div>

                        <Card style={{ height: "700px" }} className="card_container_custom_style_admin">

                            <Card.Header className="card_header_section_table_admin">
                                <h4 className="text-center">Work Experience</h4>
                            </Card.Header>

                            {

                                (!useLoadWorkExperienceData) ? (
                                    <>
                                        {
                                            (!useWorkExperienceData.ok) ? <MessageServer message_server={useWorkExperienceData.message} title="Work Experience" alert_class="alert_message_server_red" /> : null
                                        }
                                        {
                                            useWorkExperienceData.ok ? <TableWorkExperience useWorkExperienceData={useWorkExperienceData} onGetToUpdateData={onGetToUpdateData} onDeleteData={onDeleteData} /> : null
                                        }
                                    </>
                                ) : <LoadingComponent title="Work Experience" />
                            }

                        </Card>
                    </Col>

                </Row>
            </Container>


            {/* MODAL */}
            <ModalUpdateAndCreate
                useIsOpenModal={useIsOpenModal}
                onCloseModal={onCloseModal}
                useModalTitle={useModalTitle}>

                {
                    useModalContentBody
                }

            </ModalUpdateAndCreate>

        </>


    );

}


export default WorkExperienceList;