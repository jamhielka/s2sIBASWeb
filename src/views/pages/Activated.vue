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
        <v-toolbar-title>Approved JO</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>

        <v-dialog v-model="dialog" max-width="600px">
          <v-card>
            <v-card-title class="text-h5">Photo</v-card-title>
            <v-card-text>
              <PhotoDialog :data="approveData"></PhotoDialog>
            </v-card-text>
            <v-card-actions> 
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Close</v-btn>

              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogMaterials" max-width="600px">
          <v-card>
             <v-card-title class="text-h5">Materials</v-card-title>
            <v-card-text>
              <MaterialsDialog :data="materialsData"></MaterialsDialog>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Close</v-btn
              >
              <v-btn color="Warning" text @click="ItemConfirm"
                >Completed</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
//import moment from "moment";
import axios from "axios";
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
    dialog: false,
    dialogMaterials: false,
    dialogSchedule: false,
    loadTable:false,
    headers: [
      {
        text: "Reference Number",
        align: "start",
        sortable: true,
        value: "referenceNumber",
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
        .get("acquisition/report?report=activated", {
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
        })
        .catch((e) => {
          //this.table.loading = false;
          console.log(e);
        });
    },
    editItem(item) {
      // console.log( Object.assign({}, item));
      this.approveData = Object.assign({}, item);

      this.dialog = true;
    },
    SchedItemConfirm() {
      var TToken = localStorage.getItem("token");
      console.log("token", TToken);
      //this.scheduleItem.date=moment(this.scheduleItem.date).format("MM-DD-YYYY");
      console.log("log", this.scheduleItem.shiftId);
      console.log("log", this.scheduleItem.date);
      console.log("log", this.scheduleItem.employeeId);
      // this.scheduleItem.employeeId = ;
      // this.desserts.splice(this.editedIndex, 1);

      axios
        .post(
          "http://161.49.63.45:8085/api/admin/schedule",
          this.scheduleItem,
          {
            headers: {
              Authorization: `Bearer ${this.authToken}`,
              Accept: "application/json",
            },
          }
        )
        .then((response) => {
          console.log(response);
          this.dialogSchedule = false;
        });

      this.closeSched();
    },
    //scheduleItemX(item) {
    //this.$router.push({
    // name: 'Add Employee',
    // params: {
    //      editedItemX: Object.assign({}, item)
    //  }
    //});/

    //this.scheduleItem.employeeId=item._id;
    // this.loadShift();
    //this.approveData= Object.assign({}, item);

    // this.dialogSchedule = true;
    //},

    MaterialsItem(item) {
      this.materialsData = Object.assign({}, item);
      this.dialogMaterials = true;
    },

    ItemConfirm() {
     // var TToken = localStorage.getItem("token");
      console.log("ItemConfirm " + this.materialsData.referenceNumber);
   this.editedItem.referenceNumber=this.materialsData.referenceNumber;
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
          alert(this.materialsData.firstName+""+this.materialsData.lastName+" is successfully completed");
        })
        .catch((e) => {
          console.log(e);
          //this.loadingBtn = false;
        });
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
      this.dialogMaterials = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    closeSched() {
      this.dialogSchedule = false;
    },
    save() {
      var TToken = localStorage.getItem("token");
      if (this.editedIndex > -1) {
        this.$api
          .put("/admin/employee", this.editedItem, {
            headers: {
              Authorization: TToken,
            },
          })
          .then((response) => {
            console.log(response);
            this.$emit("obj", true);
            // this.loadingBtn = false;

            this.dialog = false;
            alert("employee is successfully edited");
          })
          .catch((e) => {
            console.log(e);
            //this.loadingBtn = false;
          });
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.$api
          .post("/admin/employee", this.editedItem, {
            headers: {
              Authorization: TToken,
            },
          })
          .then((response) => {
            console.log(response);
            this.$emit("obj", true);
            // this.loadingBtn = false;

            this.dialog = false;
            alert("employee is successfully created");
            this.initialize();
          })
          .catch((e) => {
            console.log(e);
            //this.loadingBtn = false;
          });
      }
      this.close();
    },
    

  },
};
</script>