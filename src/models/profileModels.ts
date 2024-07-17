import mongoose from "mongoose";

const generalProfileSchema = new mongoose.Schema({

});

const ApplicationProfileSchema = new mongoose.Schema({
   "name": String,
   "name_bn": String,
   "father": String,
   "father_bn": String,
   "mother": String,
   "mother_bn": String,
   "dob": String,
   "religion": String,
   "gender": String,
   "nid": String,
   "nid_no": String,
   "breg": String,
   "breg_no": String,
   "passport": String,
   "marital_status": String,
   "mobile": String,
   "confirm_mobile": String,
   "email": String,
   "quota": String,
   "dep_status": String,
   "present_careof": String,
   "present_village": String,
   "present_district": String,
   "present_upazila": String,
   "present_post": String,
   "present_postcode": String,
   "same_as_present": String,
   "permanent_careof": String,
   "permanent_village": String,
   "permanent_district": String,
   "permanent_upazila": String,
   "permanent_post": String,
   "permanent_postcode": String,
   "ssc_exam": String,
   "ssc_roll": String,
   "ssc_group": String,
   "ssc_board": String,
   "ssc_result_type": String,
   "ssc_result": String,
   "ssc_year": String,
   "hsc_exam": String,
   "hsc_roll": String,
   "hsc_group": String,
   "hsc_board": String,
   "hsc_result_type": String,
   "hsc_result": String,
   "hsc_year": String,
   "gra_exam": String,
   "gra_institute": String,
   "gra_year": String,
   "gra_subject": String,
   "gra_result_type": String,
   "gra_result": String,
   "gra_duration": String,
   "if_applicable_mas": String,
   "mas_exam": String,
   "mas_institute": String,
   "mas_year": String,
   "mas_subject": String,
   "mas_result_type": String,
   "mas_duration": String
});

const ApplicationProfile = mongoose.model('job_profile', ApplicationProfileSchema);

export default ApplicationProfile;
