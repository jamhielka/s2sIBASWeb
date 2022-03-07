<template>
    <!-- ----------------------------------------------------------------------------- -->
    <!-- TableSimpleDarktheme -->
    <!-- ----------------------------------------------------------------------------- -->
    <div>
        <v-list-item-subtitle class="text-wrap">
        Use <code>dark</code> prop to switch table to the dark theme.
        </v-list-item-subtitle>
        <div class="mt-4">
      <v-data-table
      :headers="table.headers"
      :items="table.data"
      :items-per-page="10"
      :loading="table.loading"
      item-key="id"
      :search="search"
      loading-text="Loading... Please wait"
      class="elevation-1">
     

    
    </v-data-table>
        </div>
    </div>
</template>

<script>
import moment from "moment";

export default {
 
  data() {
    return {
      approveDialog: false,
      approveData: {},
      search: "",
      
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
        .post("WOW_WINNERLIST_VALIDATED", { uRole: "VALIDATOR" })
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

   
    refeshData() {
      this.getForValidationList();
    }
  },
  created() {
    this.getForValidationList();
  },


};
</script>
