

<template>
  <div>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title class="text-h5">Materials</v-card-title>
        <v-card-text>
          <v-card-title>
            <div class="row">
              <div class="col-md-12" style="padding: 0">
                <h5 style="font-size: small">
                  REF. NO:{{ this.IData.referenceNumber }}
                </h5>
              </div>
              <div class="col-md-12" style="padding: 0">
                <h5 style="font-size: small">
                  NAME:
                  {{
                    this.IData.firstName.toUpperCase() +
                    " " +
                    this.IData.lastName.toUpperCase()
                  }}
                </h5>
              </div>
              <div class="col-md-12" style="padding: 0">
                <h5 style="font-size: small">
                  CITY: {{ this.IData.city.toUpperCase() }}
                </h5>
              </div>
            </div>
          </v-card-title>
<v-btn color="primary" class="ml-auto">
                    <download-csv :data="exportData" :name="`${fileName}.csv`">
                      <v-icon dense>mdi-download</v-icon>
                      Export
                    </download-csv>
                  </v-btn>

          <v-data-table
            dense
            :headers="headers"
            :items="desserts"
            item-key="name"
            loading="loadTable"
            loading-text="Loading... Please wait"
            class="elevation-1"
          >
            <template v-slot:[`item.quantity`]="{ item }">
              <div v-if="item.quantity">
                {{ item.quantity }}
              </div>
              <div v-else>
                <v-btn x-small> Upload </v-btn>
              </div>

              <!-- <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title class="text-h5">Photo</v-card-title>
          <v-card-text>
            <img :src="item.filename" />
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">Close</v-btn>

            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog> -->
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="close()">Close</v-btn>
          <v-btn color="warning" text @click="ItemConfirm()">Completed</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data: () => ({
    Udata: {
      referenceNumber: "",
    },
    Rdata: {
      preferenceNo: "",
    },
    IData: {
      firstName: "",
      lastName: "",
      referenceNumber: "",
      city: "",
    },
    dialog: false,
    loadTable: false,
    desserts: [],
    headers: [
      {
        text: "ID",
        align: "start",
        sortable: false,
        value: "id",
      },

      { text: "NAME", value: "NAME" },
      { text: "CODE", value: "code" },
      { text: "DATE CREATED", value: "dtcreated" },
      { text: "QUANTITY", value: "quantity" },
    ],
    exportData:[],
    fileName:"",
  }),
  props: ["data", "dialog"],

  watch: {
    dialog: function () {
      console.log(this.$props.data.referenceNumber);
      this.Rdata.preferenceNo = this.$props.data.referenceNumber;
      console.log(this.Rdata);
      this.IData = this.$props.data;
      this.$api2
        .post("/Ibas/MaterialsWeb", this.Rdata, {
          //headers: {
          // Authorization: `Bearer ${this.authToken}`,
          // Accept: "application/json",
          //},
        })
        .then((res) => {
          this.desserts = res.data.materials;
          this.loadTable = false;
          let exportData = res.data.materials.map((item) => {
            return {
              "Subscriber_Name": this.IData.firstName.toUpperCase() +
                    " " +
                    this.IData.lastName.toUpperCase(),
              "Reference_No":  this.Rdata.preferenceNo ,
              "Name": item.NAME,
              "Code": item.CODE,
              "Quantity": item.quantity,
              " Date": item.dtcreated ? moment(item.dtcreated).format("MMMM DD, YYYY hh:mm:ss") : "",
              
            };
          });
          this.fileName = `Ibas_materials_${moment(
            moment().toDate()
          ).format("MMM_DD_YYYY")}`;
          this.exportData = exportData;
        });
      //this.loadPhoto();
    },
  },
  methods: {
    close() {
      this.$emit("close", false);
    },
    ItemConfirm() {
      this.$emit("ItemConfirmed", true);
    },
  },
};
</script>