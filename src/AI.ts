import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const defaultHtml = `<fieldset style="border:1px solid;margin-top:10px">
                                                <legend class="h6">Present Address <span class="bangla_font">(বর্তমান ঠিকানা)</span><span class="required">*</span></legend>
                                                <div class="form-group">
                                                    <label for="present_careof" class="col-sm-4 control-label">Care Of<span class="required">*</span></label>
                                                    <div class="col-sm-8">
                                                        <input type="text" name="present_careof" id="present_careof" maxlength="50" placeholder="" class="form-control textTransform" required="">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="present_village" class="col-sm-4 control-label">Village/ Road/ House/ Flat<span class="required">*</span></label>
                                                    <div class="col-sm-8">
                                                        <textarea name="present_village" id="present_village" class="form-control" maxlength="150" onpaste="return false" required=""></textarea>

                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="present_district" class="col-sm-4 control-label">District<span class="required">*</span></label>
                                                    <div class="col-sm-8">
                                                        <select name="present_district" id="present_district" class="form-control" onchange="onChangeDistrict(this,'present_upazila')" required="">
                                                            <option value="" selected="" disabled="">Select</option>
                                                            <option value="26">Bagerhat</option><option value="64">Bandarban</option><option value="32">Barguna</option><option value="29">Barishal</option><option value="30">Bhola</option><option value="10">Bogura</option><option value="54">Brahmanbaria</option><option value="56">Chandpur</option><option value="13">Chapai Nawabganj</option><option value="60">Chattogram</option><option value="19">Chuadanga</option><option value="61">Cox's Bazar</option><option value="55">Cumilla</option><option value="40">Dhaka</option><option value="3">Dinajpur</option><option value="45">Faridpur</option><option value="59">Feni</option><option value="8">Gaibandha</option><option value="41">Gazipur</option><option value="47">Gopalganj</option><option value="53">Habiganj</option><option value="36">Jamalpur</option><option value="23">Jashore</option><option value="28">Jhalakathi</option><option value="20">Jhenaidah</option><option value="9">Joypurhat</option><option value="62">Khagrachhari</option><option value="25">Khulna</option><option value="38">Kishoreganj</option><option value="7">Kurigram</option><option value="17">Kushtia</option><option value="57">Lakshmipur</option><option value="5">Lalmonirhat</option><option value="48">Madaripur</option><option value="21">Magura</option><option value="39">Manikganj</option><option value="18">Meherpur</option><option value="52">Moulvibazar</option><option value="44">Munshiganj</option><option value="34">Mymensingh</option><option value="11">Naogaon</option><option value="22">Narail</option><option value="43">Narayanganj</option><option value="42">Narsingdi</option><option value="12">Natore</option><option value="33">Netrokona</option><option value="4">Nilphamari</option><option value="58">Noakhali</option><option value="16">Pabna</option><option value="1">Panchagarh</option><option value="31">Patuakhali</option><option value="27">Pirojpur</option><option value="46">Rajbari</option><option value="14">Rajshahi</option><option value="63">Rangamati</option><option value="6">Rangpur</option><option value="24">Satkhira</option><option value="49">Shariatpur</option><option value="35">Sherpur</option><option value="15">Sirajganj</option><option value="50">Sunamganj</option><option value="51">Sylhet</option><option value="37">Tangail</option><option value="2">Thakurgaon</option>                                                        </select>

                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="present_upazila" class="col-sm-4 control-label">Upazila/P.S.<span class="required">*</span></label>
                                                    <div class="col-sm-8">
                                                        <select name="present_upazila" id="present_upazila" class="form-control" onchange="onChangePresentUpazila()" required="">
                                                            <option value="" selected="" disabled="">Select</option>
                                                        </select>

                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="present_post" class="col-sm-4 control-label">Post Office<span class="required">*</span></label>
                                                    <div class="col-sm-8">
                                                        <input type="text" name="present_post" id="present_post" maxlength="50" placeholder="" class="form-control" required="">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="present_postcode" class="col-sm-4 control-label">Post Code<span class="required">*</span></label>
                                                    <div class="col-sm-8">
                                                        <input type="number" name="present_postcode" id="present_postcode" maxlength="4" min="1000" max="9999" placeholder="" class="form-control" required="">
                                                    </div>
                                                </div>
                                            </fieldset>`;

export async function getGroqChatCompletion(
  element: HTMLElement | string = defaultHtml
) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "JSON",
      },
      {
        role: "user",
        content: `Extract the id attribute from the following HTML element and also what it asking for. Return the extracted data as a JSON object like: {[id]:[asking for]}. Here is the HTML element: ${element}`,
      },
    ],
    model: "llama3-70b-8192",
    temperature: 1,
    max_tokens: 8192,
    top_p: 1,
    stream: false,
    response_format: {
      type: "json_object",
    },
    stop: null,
  });
}
