<template>
  <v-data-table
    :headers="headers"
    :items="desserts"
    sort-by="name"
    item-key="_id"
    class="elevation-1"
  >
    <template v-slot:[`item.publicPath`]="{ item }">
      <img :src="item.publicPath" style="width: 50px; height: 50px" />
    </template>
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Events</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <div>
          <CreateDialog></CreateDialog>
        </div>
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-form ref="form" lazy-validation>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col>
                      <v-card>
                        <v-img
                          :src="editedItem.publicPath"
                          max-height="125"
                          class="grey darken-4"
                        ></v-img>
                        <v-card-title class="text-h6">
                          {{ editedItem.name }}
                        </v-card-title>
                      </v-card>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.name"
                        label="Name"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.shortDescription"
                        label="short Description"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.longDescription"
                        label="longDescription"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="mt-0 pt-0">
                      <v-select
                        v-model="editedItem.type"
                        :items="['STATIC_BID', 'BLIND_BID', 'CLASSIC_BID']"
                        label="Type*"
                        @change="cascade"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" class="mt-0 pt-0">
                      <v-text-field
                        label="Bid Amount"
                        v-model="editedItem.bidAmount"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="mt-0 pt-0">
                      <v-text-field
                        label="Countdown"
                        v-model="editedItem.countdown"
                        v-if="showName"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" class="mt-0 pt-0">
                      <v-text-field
                        label="First Warning"
                        v-model="editedItem.firstWarning"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="mt-0 pt-0">
                      <v-text-field
                        label="Second Warning"
                        v-model="editedItem.secondWarning"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="mt-0 pt-0">
                      <v-datetime-picker
                        label="Registration Date *"
                        v-model="editedItem.registrationDate"
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
                        v-model="editedItem.startDate"
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
                        v-model="editedItem.endDate"
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

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  :loading="loadingBtn"
                  :disabled="loadingBtn"
                  @click="save"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Are you sure you want to delete this item?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>

      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
  </v-data-table>
</template>

<script>
import moment from "moment";
import CreateDialog from "../dialogs/createGame.vue";

export default {
  name: "Draw",
  components: {
    CreateDialog,
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "Image",
        align: "start",
        sortable: false,
        value: "publicPath",
      },
      {
        text: "Events Name",
        align: "start",
        sortable: false,
        value: "name",
      },

      { text: "Description", value: "shortDescription" },

      { text: "Type", value: "type" },
      { text: "Bid Amount", value: "bidAmount" },
      { text: "Status", value: "status" },
      { text: "Date Created", value: "createdDateTimeLabel" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      shortDescription: "",
      longDescription: "",
      type: "",
      bidAmount: "",
      status: "",
    },
    defaultItem: {
      name: "",
      shortDescription: "",
      longDescription: "",
      type: "",
      bidAmount: "",
      status: "",
    },
    textFieldProps: {
      prependIcon: "mdi-calendar-month-outline",
      rules: [(value) => !!value || "Required."],
    },
    timeProps: {
      useSeconds: true,
      ampmInTitle: true,
    },
    showName: true,
    loadingBtn: false,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.getForMerchantList();
  },

  methods: {
    cascade: function (e) {
      console.log("Show " + e + " fields");
      if (e != "STATIC_BID") {
        this.showName = false;
      } else {
        this.showName = true;
      }
    },
    async getForMerchantList() {
      // this.table.loading = true;
      var TToken = localStorage.getItem("token");
      //console.log(TToken);
      await this.$api
        .get("events?merchantId=" + this.$route.query.ID, {
          headers: {
            "wsc-token": TToken,
          },
        })

        .then((response) => {
          console.log(response);
          const newArr = response.data.data.events;
          this.desserts = newArr;
          //this.table.loading = false;
        })
        .catch((e) => {
          //this.table.loading = false;
          console.log(e);
        });
    },
    refeshData() {
      this.getForMerchantList();
    },
    editItem(item) {
      item.registrationDate = new Date(item.registrationDate);
      item.startDate = new Date(item.startDate);
      item.endDate = new Date(item.endDate);
      //console.log(item.registrationDate);
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

  async save() {
     
        //this.desserts.push(this.editedItem);
        console.log(this.editedItem);
      
      const formData = new FormData();

      formData.append("merchantId", this.$route.query.ID);
      formData.append("_id", this.editedItem._id)
      formData.append("name", this.editedItem.name);
      formData.append("shortDescription", this.editedItem.shortDescription);
      formData.append("longDescription", this.editedItem.longDescription);
      formData.append("bidAmount", this.editedItem.bidAmount);
      formData.append("registrationDate", moment().valueOf(this.editedItem.registrationDate));
      formData.append("startDate", moment().valueOf(this.editedItem.startDate) );
      formData.append("endDate", moment().valueOf(this.editedItem.endDate));
      formData.append("countdown", this.editedItem.countdown);
      formData.append("firstWarning", this.editedItem.firstWarning);
      formData.append("secondWarning", this.editedItem.secondWarning);
      formData.append("type", this.editedItem.type);
      formData.append("photo", "");
      for (var value of formData.values()) {
   console.log(value);
}

      // console.log(this.editedItem.bidAmount);
     // data.startDate = moment().valueOf(data.startDate);

     // data.endDate = moment().valueOf(data.endDate);
      //  data.registrationDate = moment().valueOf(data.registrationDate);
    
        await this.$api
          .post("events", formData)
          .then((response) => {
            console.log(response.data.data);
            //this.$emit("obj", true);
            this.loadingBtn = false;
            //this.$refs.form.reset();
            this.dialog = false;
            alert("Events is successfully updated");
          })
          .catch((e) => {
           console.log(e);
           this.loadingBtn = false;
         });
      
      this.close();
    },

    createDialogReponse() {},
  },
};
</script>