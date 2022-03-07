<template>
  <div>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="table.headers"
      :items="table.data"
      :items-per-page="10"
      :loading="table.loading"
      item-key="id"
      :search="search"
      loading-text="Loading... Please wait"
      class="elevation-1"
    >
      <template
        v-for="header in table.headers.filter((header) =>
          header.hasOwnProperty('formatter')
        )"
        v-slot:[`item.${header.value}`]="{ value }"
      >
        {{ header.formatter(value) }}
      </template>

      <!-- <template v-slot:[`item.actions`]="{ item }">
        <v-btn x-small color="primary" class="mr-1" dark @click="approve(item)">
          Approve</v-btn
        >

        <v-btn x-small color="pink" dark @click="editDrawDetail(item)">
          Reject</v-btn
        >
      </template> -->
    </v-data-table>

    <ApproveDialog
      :dialog="approveDialog"
      :data="approveData"
      @close="closeApproveDialog"
      @refeshData="refeshData"
    ></ApproveDialog>
  </div>
</template>

<script>
import moment from "moment";
import ApproveDialog from "../dialogs/ApproveDialog.vue";
export default {
  components: {
    ApproveDialog,
  },
  data() {
    return {
      approveDialog: false,
      approveData: {},
      search: "",
      paths: {
        viewInfo: "/draw/view",
      },
      table: {
        sortBy: "dtCreated",
        sortDesc: true,
        loading: false,
        headers: [
          {
            text: "Draw Date",
            align: "start",
            sortable: false,
            value: "DTDraw",
            formatter: (x) => (x ? moment(x).format("MMMM DD, YYYY") : null),
          },
          {
            text: "Name",
            align: "start",
            value: "name",
          },
          {
            text: "Address",
            align: "start",
            value: "address",
          },
          {
            text: "Age",
            align: "center",
            value: "Age",
          },
          {
            text: "Dose",
            align: "center",
            value: "DOSE",
          },
          {
            text: "Vaccine Brand",
            align: "start",
            value: "BRAND",
          },
          {
            text: "Date of Vaccination",
            value: "Date_Vaccination",
            align: "center",
          },
          {
            text: "Remarks",
            value: "Remarks",
            align: "center",
            sortable: false,
          },
        ],
        data: [],
      },
    };
  },
  methods: {
    async getForValidationList() {
      this.table.loading = true;
      await this.$api
        .post("WOW_WINNERLIST_VALIDATED", { uRole: this.getPartner })
        .then((response) => {
          console.log(response)
          const newArr = response.data.data;
          this.table.data = newArr;
          this.table.loading = false;
        })
        .catch((e) => {
          this.table.loading = false;
          console.log(e);
        });
    },

    approve(data) {
      this.approveData = data;
      this.approveDialog = true;
    },

    closeApproveDialog() {
      this.approveDialog = false;
    },

    refeshData() {
      this.getForValidationList();
    }
  },
  created() {
    this.getForValidationList();
  },


  computed: {
    getPartner() {
      return this.$store.getters.getPartner;
    },
  },
};
</script>
