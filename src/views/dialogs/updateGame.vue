<template>

      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-form ref="form" lazy-validation>
            <v-card-title>
              <span>Update Event</span>

              <!-- <v-spacer></v-spacer>
              <v-btn fab x-small @click="closeDialog">
                <v-icon>mdi-close</v-icon>
              </v-btn> -->
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" class="mt-0 pt-0">
                    <v-text-field
                      label="Name*"
                      v-model="form.name"
                      :rules="rules.required"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" class="mt-0 pt-0">
                    <v-file-input
                      truncate-length="15"
                      label="Photo"
                      v-model="form.photo"

                    ></v-file-input>
                  </v-col>
                  <v-col cols="12" class="mt-0 pt-0">
                    <v-text-field
                      label="Short Description*"
                      v-model="form.shortDescription"
                      :rules="rules.required"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" class="mt-0 pt-0">
                    <v-text-field
                      label="Long Description*"
                      v-model="form.longDescription"
                      :rules="rules.required"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" class="mt-0 pt-0">
                    <v-select
                     v-model="form.type"
                      :items="['STATIC_BID', 'BLIND_BID', 'CLASSIC_BID']"
                      label="Type*"
                      @change="cascade"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12" class="mt-0 pt-0">
                    <v-text-field
                      label="Bid Amount"
                      v-model="form.bidAmount"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" class="mt-0 pt-0">
                    <v-text-field
                      label="Countdown"
                      v-model="form.countdown"
                      v-if="showName"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" class="mt-0 pt-0">
                    <v-text-field
                      label="First Warning"
                      v-model="form.firstWarning"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" class="mt-0 pt-0">
                    <v-text-field
                      label="Second Warning"
                      v-model="form.secondWarning"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" class="mt-0 pt-0">
                    <v-datetime-picker
                      label="Registration Date *"
                      v-model="form.registrationDate"
                      :text-field-props="textFieldProps"
                      :time-picker-props="timeProps"
                      time-format="HH:mm:ss"
                    >
                      <template slot="dateIcon">
                        <v-icon>mdi-calendar-month</v-icon>
                      </template>
                      <template slot="timeIcon">
                        <v-icon>mdi-clock-time-nine-outline</v-icon>
                      </template>
                    </v-datetime-picker>
                  </v-col>
                  <v-col cols="12" sm="6" class="mt-0 pt-0">
                    <v-datetime-picker
                      label="Start Date *"
                      v-model="form.startDate"
                      :text-field-props="textFieldProps"
                      :time-picker-props="timeProps"
                      time-format="HH:mm:ss"
                    >
                      <template slot="dateIcon">
                        <v-icon>mdi-calendar-month</v-icon>
                      </template>
                      <template slot="timeIcon">
                        <v-icon>mdi-clock-time-nine-outline</v-icon>
                      </template>
                    </v-datetime-picker>
                  </v-col>

                  <v-col cols="12" sm="6" class="mt-0 pt-0">
                    <v-datetime-picker
                      label="End Date *"
                      v-model="form.endDate"
                      :text-field-props="textFieldProps"
                      :time-picker-props="timeProps"
                      time-format="HH:mm:ss"
                      date-format="yyyy-MM-dd"
                    >
                      <template slot="dateIcon">
                        <v-icon>mdi-calendar-month</v-icon>
                      </template>
                      <template slot="timeIcon">
                        <v-icon>mdi-clock-time-nine-outline</v-icon>
                      </template>
                    </v-datetime-picker>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
             <v-card-actions class="pb-5">
              <v-spacer></v-spacer>
              <v-btn :disabled="loadingBtn" @click="closeDialog()">
                Close
              </v-btn>
              <v-btn
                color="primary"
                :loading="loadingBtn"
                :disabled="loadingBtn"
                @click="onSubmit()"
                class="px-10"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
  
</template>

<script>
import moment from "moment";

export default {
  data() {
    return {
       textFieldProps: {
        prependIcon: "mdi-calendar-month-outline",
        rules: [(value) => !!value || "Required."],
      },
      timeProps: {
        useSeconds: true,
        ampmInTitle: true,
      },
      //Edialog:false,
       showName: true,
  loadingBtn: false,
//dialog: false,
      responseMessage: "",
      rules: {
        required: [(value) => !!value || "Required."],
      },
      form: {
        to: "",
        text: "",
        id: 0,
        UserId: this.$store.getters.getUsername,
      },
      
    };
  },
  props: ["data", "dialog"],

  methods: {
        cascade: function (e) {
      console.log("Show " + e + " fields");
      if (e != "STATIC_BID") {
        this.showName = false;
      } else {
        this.showName = true;
      }
    },
   async onSubmit() {
      if (!this.$refs.form.validate()) {
        return false;
      }

      this.loadingBtn = true;
      let data = this.form;
      data.startDate = moment().valueOf(data.startDate);


      data.endDate = moment().valueOf(data.endDate);
       data.registrationDate = moment().valueOf(data.registrationDate);
      const formData = new FormData();

      formData.append("merchantId", this.$route.query.ID);
      formData.append("name", data.name);
      formData.append("shortDescription", data.shortDescription);
      formData.append("longDescription", data.longDescription);
      formData.append("bidAmount", data.bidAmount);
      formData.append("registrationDate", data.registrationDate);
      formData.append("startDate", data.startDate);
      formData.append("endDate", data.endDate);
      formData.append("countdown", data.countdown);
      formData.append("firstWarning", data.firstWarning);
      formData.append("secondWarning", data.secondWarning);
      formData.append("type", data.type);
      formData.append("photo", data.photo);
      for (var value of formData.values()) {
   console.log(value);
}
      // setTimeout(() => {
      //   this.loadingBtn = false;
      //   this.$refs.form.reset()
      //   this.dialog = false;
      //   this.$emit("obj", true);
      // }, 3000);
       //var TToken = localStorage.getItem("token");
        
            console.log(this.$route.query.ID);
            //console.log(TToken);
 
      await this.$api
        .post("events", formData)
        .then((response) => {
          console.log(response);
        this.$emit("obj", true);
          this.loadingBtn = false;
        this.$refs.form.reset();
          this.Edialog = false;
          alert("Events is successfully created");
        })
        .catch((e) => {
          console.log(e);
          this.loadingBtn = false;
        });

      // this.$store.dispatch("addOverlay", true);
    },

    closeDialog() {
      this.dialog = false;
      //this.$refs.form.reset();
    },

    formatDate(d) {
      return moment(d).format("YYYY-MM-DD HH:mm:ss");
    },
  },

  watch: {
    updateDialog: function() {
      // watch it
      console.log(this.data.name);
     // this.form.name = this.data.name;
      //if(this.data.id){
       // this.form.id = this.data.id;
      //}
     
      //this.form.text = "";
     // if(!this.dialog){
     //   this.$refs.form.resetValidation();
     // }
    },
  },
};
</script>
