<template>
  <v-data-table
    :headers="headers"
    :items="desserts"
    :search="search"
    loading="loadTable"
    loading-text="Loading... Please wait"
    sort-by="name"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Completed JO</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>

        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn color="primary" class="ml-auto">
          <download-csv :data="exportData" :name="`${fileName}.csv`">
            <v-icon dense>mdi-download</v-icon>
            Export
          </download-csv>
        </v-btn>
        <PhotoDialog
          :data="approveData"
          :dialog="photoDialog.dialog"
          @close="photoDialog.dialog = !photoDialog.dialog"
        ></PhotoDialog>

        <MaterialsDialog
          :data="materialsData"
          :dialog="materialsDialog.dialog"
          @close="materialsDialog.dialog = !materialsDialog.dialog"
          @ItemConfirmed="ItemConfirm()"
        ></MaterialsDialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-btn x-small tile color="success" @click="editItem(item)">
        <v-icon left> mdi-pencil </v-icon>
        Photo
      </v-btn>
      <v-btn x-small tile color="warning" @click="MaterialsItem(item)">
        <v-icon left> mdi-delete </v-icon>
        Materials
      </v-btn>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Reset </v-btn>
    </template>
  </v-data-table>
</template>
<script>
import moment from "moment";
//import axios from "axios";
import PhotoDialog from "../dialogs/photo.vue";
import MaterialsDialog from "../dialogs/materials.vue";
export default {
  components: {
    PhotoDialog,
    MaterialsDialog,
  },
  data: () => ({
    search: "",
    approveData: {},
    materialsData: {},

    photoDialog: { dialog: false },
    materialsDialog: { dialog: false },
    loadTable: false,
    headers: [
      {
        text: "Date Installed",
        align: "start",
        sortable: true,
        value: "activationDateLabel",
      },
      {
        text: "Reference Number",
        align: "start",
        sortable: true,
        value: "referenceNumber",
      },
      {
        text: "JO No.",

        sortable: true,
        value: "account.jo_no",
      },
      {
        text: "First Name",
        align: "start",
        sortable: false,
        value: "firstName",
      },
      { text: "Last Name", value: "lastName" },
      { text: "address", value: "address" },
      { text: "city", value: "city" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    desserts: [],
    listShift: [],
    editedIndex: -1,
    editedItem: {
      referenceNumber: "",
    },
    scheduleItem: {
      employeeId: 0,
      shiftId: 0,
      date: "",
    },
    defaultItem: {
      name: "",
      code: "",
    },
    modalScheduleDate: false,
    exportData: [],
    fileName: "",
    Rdata: {
      preferenceNo: "",
    },
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
    this.initialize();
  },

  methods: {
    initialize() {
      this.getForMerchantList();
    },

    async getForMerchantList() {
      // this.table.loading = true;
      var TToken = localStorage.getItem("token");
      // console.log(TToken);
      await this.$api
        .get("acquisition/report?report=completed-jo", {
          headers: {
            "wsc-token": TToken,
          },
        })

        .then((response) => {
          //  console.log(response);
          const newArr = response.data.data;
          this.desserts = newArr;
          this.loadTable = false;
          //this.table.loading = false;

          for (let i = 0; i < newArr.length; i++) {
            this.tmp = {
              Date_Installed: newArr[i].activationDateLabel,
              JO_No: newArr[i].account.jo_no,
              Account_No: newArr[i].accountNumber,
              Reference_No: newArr[i].referenceNumber,
            };
            this.Rdata.preferenceNo = newArr[i].referenceNumber;
            this.$api2
              .post("/Ibas/MaterialsWeb", this.Rdata, {
                //headers: {
                // Authorization: `Bearer ${this.authToken}`,
                // Accept: "application/json",
                //},
              })
              .then((res) => {
                const newMaterials = res.data.materials;
                var obj = {};
                for (var x = 0; x < newMaterials.length; x++) {
                  obj["Date_Installed"] = newArr[i].activationDateLabel;
                  obj["JO_No"] = newArr[i].account.jo_no;
                  obj["Account_No"] = newArr[i].accountNumber;
                  obj["Reference_No"] = newArr[i].referenceNumber;
                  obj["Serial_No"] = newArr[i].serialNumber;

                  obj[newMaterials[x]["NAME"]] = newMaterials[x]["quantity"];
                }
                //let z=Object.assign(this.tmp, obj)
                this.exportData.push(obj);
                //console.log(obj);
                //let exportData.push(obj;
                this.fileName = `Ibas_materials_${moment(
                  moment().toDate()
                ).format("MMM_DD_YYYY")}`;
                // this.exportData = exportData;
                // console.log(this.exportData);
              });
          }
        })
        .catch((e) => {
          //this.table.loading = false;
          console.log(e);
        });
    },
    editItem(item) {
      // console.log( Object.assign({}, item));
      this.approveData = Object.assign({}, item);

      this.photoDialog.dialog = true;
    },

    MaterialsItem(item) {
      this.materialsData = Object.assign({}, item);
      this.materialsDialog.dialog = true;
    },

    ItemConfirm() {
      // var TToken = localStorage.getItem("token");
      console.log("ItemConfirm " + this.materialsData.referenceNumber);
      this.editedItem.referenceNumber = this.materialsData.referenceNumber;
      this.$api
        .post(
          "acquisition/complete-jo",

          this.editedItem
        )
        .then((response) => {
          console.log(response);
          this.$emit("obj", true);
          // this.loadingBtn = false;

          this.dialog = false;
          alert(
            this.materialsData.firstName +
              "" +
              this.materialsData.lastName +
              " is successfully completed"
          );
        })
        .catch((e) => {
          console.log(e);
          //this.loadingBtn = false;
        });
      this.materialsDialog.dialog = false;
    },
  },
};
</script>