

const { charCapital } = require("../HELPERS/char_capital");
const { getdate, getHour } = require("../HELPERS/get_date_hour");
const Skill = require("../model/Skill_model");
const { jwt_decodeToken } = require("../HELPERS/jwt-simple");

const { validateURLPattern } = require("../HELPERS/url_validate");

// Para validar que sea un id objeto de mongoose. Debemos de introducir la id para que valide.
var ObjectId = require('mongoose').Types.ObjectId;

const User = require("../model/User_model");

// CREAMOS UN NUEVO RECURSO
const postSkill = (req, res) => {

    const { title, url_img } = req.body;

    const skill = new Skill();

    if (Object.keys(req.body).length === 0) {
        res.status(404).json({
            ok: false,
            message: "Please fill the body with some field."
        });

    } else {

        if (title.trim() === "") {
            res.status(404).json({
                ok: false,
                message: "The field Title is required."
            });

        } else if (url_img.trim() === "") {

            res.status(404).json({
                ok: false,
                message: "The field Url Img is required."
            });

        } else if (!validateURLPattern(url_img.trim())) {

            res.status(404).json({
                ok: false,
                message: "The URL is invalid."
            });

        } else {

            // VALIDAMOS QUE EL USUARIO TOKEN DECODE COINCIDA CON EL ID DEL USUARIO REFERENCIADO AL USUARIO
            const get_headers = req.headers.usuario_autorizacion;
            // console.log(get_headers);
            // console.log(jwt_decodeToken(get_headers));

            if (get_headers) {
                var user_id_isExists = User.findOne({ _id: jwt_decodeToken(get_headers).id }).exec();

                user_id_isExists.then((data_user) => {

                    if (!data_user) {
                        res.status(500).json({
                            ok: false,
                            message: "User not found."
                        });

                    } else {

                        // console.log(data_user.id, jwt_decodeToken(get_headers).id);

                        if (data_user._id.toString() !== jwt_decodeToken(get_headers).id) {

                            res.status(500).json({
                                ok: false,
                                message: "User id not match. "
                            });

                        } else {

                            console.log("READY...");

                            var skill_isExist = Skill.findOne({ title: charCapital(title), user_id: data_user._id }).exec();

                            skill_isExist.then((data) => {

                                if (!data) {

                                    skill.title = charCapital(title.trim());
                                    skill.url_img = url_img.trim();

                                    skill.date_register = {
                                        date: getdate(new Date),
                                        hour: getHour(new Date)
                                    };

                                    skill.user_id = data_user._id;
                                    // console.log(data_user._id);

                                    skill.save();

                                    res.status(201).json({
                                        ok: true,
                                        message: "Resource created successfully."
                                    });

                                } else {
                                    res.status(500).json({
                                        ok: false,
                                        message: "There is already a record."
                                    });
                                }
                            });
                        }
                    }
                });

            } else {

                res.status(500).json({
                    ok: false,
                    message: "No Token."
                });
            }

        }
    }
}


// OBTENEMOS TODOS LOS RECURSOS
const getSkillsAdmin = async (req, res) => {

    // VALIDAMOS QUE EL USUARIO TOKEN DECODE COINCIDA CON EL ID DEL USUARIO REFERENCIADO AL USUARIO
    const get_headers = req.headers.usuario_autorizacion;
    // console.log(get_headers);
    // console.log(jwt_decodeToken(get_headers));


    if (get_headers) {
        var user_id_isExists = User.findOne({ _id: jwt_decodeToken(get_headers).id }).exec();

        user_id_isExists.then((data_user) => {

            if (!data_user) {
                res.status(500).json({
                    ok: false,
                    message: "User not found."
                });

            } else {

                // console.log(data_user.id, jwt_decodeToken(get_headers).id);

                if (data_user._id.toString() !== jwt_decodeToken(get_headers).id) {

                    res.status(500).json({
                        ok: false,
                        message: "User id not match. "
                    });

                } else {

                    console.log("READY...");

                    var skill_isExist = Skill.findOne({ user_id: data_user._id }).exec();

                    skill_isExist.then((data) => {

                        if (!data) {

                            res.status(500).json({
                                ok: false,
                                message: "No data."
                            });

                        } else {

                            Skill.find({ user_id: data_user._id }).then((stored) => {

                                if (stored.length === 0) {
                                    res.status(404).json({
                                        ok: false,
                                        message: "No there Skill registered."
                                    });

                                } else {
                                    res.status(200).json({
                                        ok: true,
                                        message: "Getting Skill.",
                                        data: stored.sort((a, b) => (a.title > b.title) ? 1 : -1)
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    } else {

        res.status(500).json({
            ok: false,
            message: "No Token."
        });
    }


}


const getSkills = async (req, res) => {


    Skill.find().then((stored) => {

        if (stored.length === 0) {
            res.status(404).json({
                ok: false,
                message: "No there Skill registered."
            });

        } else {
            res.status(200).json({
                ok: true,
                message: "Getting Skill.",
                data: stored.sort((a, b) => (a.title > b.title) ? 1 : -1)
            });
        }
    });

}

// ACTUALIZAMOS EL RECURSO POR SU ID
const putSkillById = async (req, res) => {

    const { id } = req.params;

    const { title, url_img } = req.body;

    var id_mongo_validate = ObjectId.isValid(id);

    // console.log(id_mongo_validate); // True is valid | False not valid

    if (id_mongo_validate) {

        if (Object.keys(req.body).length === 0) {
            res.status(404).json({
                ok: false,
                message: "Please fill the body with some field."
            });

        } else {


            if (title.trim() === "") {
                res.status(404).json({
                    ok: false,
                    message: "The field Title is required"
                });

            } else if (url_img.trim() === "") {

                res.status(404).json({
                    ok: false,
                    message: "The field Url Img is required."
                });

            } else if (!validateURLPattern(url_img)) {

                res.status(404).json({
                    ok: false,
                    message: "The URL is invalid."
                });

            } else {


                // VALIDAMOS QUE EL USUARIO TOKEN DECODE COINCIDA CON EL ID DEL USUARIO REFERENCIADO AL USUARIO
                const get_headers = req.headers.usuario_autorizacion;
                // console.log(get_headers);
                // console.log(jwt_decodeToken(get_headers));

                if (get_headers) {

                    var user_id_isExists = User.findOne({ _id: jwt_decodeToken(get_headers).id }).exec();

                    user_id_isExists.then((data_user) => {

                        console.log(data_user._id.toString());

                        var skill_user_id_isExists = Skill.find({ _id: id, user_id: data_user._id }).exec();

                        skill_user_id_isExists.then((data) => {

                            if (data.length === 0) {
                                res.status(404).json({
                                    ok: false,
                                    message: "No there Skill with that id registered.",
                                });
                            } else {

                                var body_content = {
                                    title: charCapital(title.trim()),
                                    url_img: url_img.trim(),
                                    date_update: {
                                        date: getdate(new Date),
                                        hour: getHour(new Date)
                                    }
                                };

                                Skill.findByIdAndUpdate({ _id: id }, body_content, (error, stored) => {

                                    if (error) {

                                        res.status(500).json({
                                            ok: false,
                                            message: "Server Error."
                                        });

                                    } else {

                                        if (!stored) {
                                            res.status(404).json({
                                                ok: false,
                                                message: "No there Skill with that id registered."
                                            });

                                        } else {

                                            res.status(201).json({
                                                ok: true,
                                                message: "Resource updated successfully."
                                            });
                                        }
                                    }

                                });

                            }
                        });
                    });


                } else {
                    res.status(500).json({
                        ok: false,
                        message: "No Token."
                    });
                }
            }
        }

    } else {

        res.status(500).json({
            ok: false,
            message: "Id param entered is not valid."
        });
    }
}


// ELIMINAMOS EL RECURSO POR SU ID
const deleteSkillById = (req, res) => {


    const { id } = req.params;

    var id_mongo_validate = ObjectId.isValid(id);

    if (id_mongo_validate) {


        // console.log(req.headers.usuario_autorizacion);
        // console.log(jwt_decodeToken(req.headers.usuario_autorizacion));

        const get_headers = req.headers.usuario_autorizacion;

        if (get_headers) {
            // console.log(get_headers);
            // console.log(jwt_decodeToken(get_headers));
            const id_user_decode_data = jwt_decodeToken(get_headers).id;
            // console.log(id_user_decode_data);

            var user_isExists = User.findOne({ _id: id_user_decode_data }).exec();
            user_isExists.then((data_user) => {
                // console.log(data_user);

                if (!data_user) {
                    // console.log("Doesn´t exist user with that token.");
                    res.status(500).json({
                        ok: false,
                        message: "Doesn´t exist user with that token."
                    });
                } else {
                    // console.log("Adding");

                    // console.log(data_user._id.toString(), id_user_decode_data)

                    if (data_user._id.toString() !== id_user_decode_data) {

                        res.status(500).json({
                            ok: false,
                            message: "Doesn´t exist user with that token."
                        });

                    } else {

                        // VALIDAMOS QUE EL USUARIO TOKEN DECODE COINCIDA CON EL ID DEL USUARIO REFERENCIADO AL USUARIO
                        const get_headers = req.headers.usuario_autorizacion;
                        // console.log(get_headers);
                        // console.log(jwt_decodeToken(get_headers));

                        var user_id_isExists = User.findOne({ _id: jwt_decodeToken(get_headers).id }).exec();

                        user_id_isExists.then((data_user) => {

                            console.log(data_user._id.toString());

                            var skill_user_id_isExists = Skill.find({ _id: id, user_id: data_user._id }).exec();

                            skill_user_id_isExists.then((data) => {

                                // console.log(data);

                                if (data.length === 0) {
                                    res.status(404).json({
                                        ok: false,
                                        message: "No there Skill with that id registered.",
                                    });
                                } else {

                                    Skill.findByIdAndRemove(id, (error, stored) => {

                                        if (error) {
                                            res.status(500).json({
                                                ok: false,
                                                message: "Server Error."
                                            });

                                        } else {
                                            if (!stored) {

                                                res.status(404).json({
                                                    ok: false,
                                                    message: "No there Skill with that id registered.",
                                                });
                                            } else {
                                                res.status(200).json({
                                                    ok: true,
                                                    message: "Resource removed successfully."
                                                });
                                            }

                                        }
                                    });

                                }
                            });
                        });
                    }
                }
            });

        } else {

            res.status(500).json({
                ok: false,
                message: "No Token."
            });
        }

    } else {
        res.status(500).json({
            ok: false,
            message: "Id param entered is not valid."
        });
    }
}



module.exports = {
    postSkill,
    getSkills,
    getSkillsAdmin,
    putSkillById,
    deleteSkillById
}


