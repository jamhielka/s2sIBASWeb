

<template>
  <div>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title class="text-h5">Photo</v-card-title>
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

          <v-data-table
            :headers="headers"
            :items="desserts"
            item-key="referenceNumber"
            loading="loadTable"
            loading-text="Loading... Please wait"
            class="elevation-1"
          >
            <template v-slot:[`item.filename`]="{ item }">
              <div v-if="item.filename">
                <div>
                  <a href="#" @click.prevent="downloadImage(item.filename)">
                    <img
                      :src="item.filename"
                      style="width: 50px; height: 50px"
                    />
                  </a>
                </div>
              </div>
              <div v-else></div>
            </template>
            <!-- <template v-slot:expanded-item="{ headers, item }">
       <td :colspan="headers.length">

           <div v-if="item.filename">
               <img :src="item.filename" style="width: 250px; height: 250px" />
           <v-spacer></v-spacer>
   <v-btn @click="downloadImg(item.filename)" small class="warning">download</v-btn>
       
        </div>
        <div v-else>
         <v-span>No Information</v-span>
        </div>
          
      </td>
      </template>
    -->
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close()">Close</v-btn>

          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
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
      { text: "Image", value: "filename" },
      { text: "", value: "data-table-expand" },
    ],
  }),

  props: ["data", "dialog"],

  watch: {
    dialog: function () {
      console.log(this.$props.data.referenceNumber);
      this.Rdata.preferenceNo = this.$props.data.referenceNumber;
      console.log(this.Rdata);
      this.IData = this.$props.data;
      axios
        .post("http://161.49.63.45:8087/api/Ibas/PhotoWeb", this.Rdata, {
          //headers: {
          // Authorization: `Bearer ${this.authToken}`,
          // Accept: "application/json",
          //},
        })
        .then((res) => {
          this.desserts = res.data.photoType;
          this.loadTable = false;
          console.log(this.res);
        });
      //this.loadPhoto();
    },
  },
  methods: {
    downloadImage(url) {
      const filename = url.split("/").pop();
      fetch(url)
        .then((resp) => resp.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          // the filename you want
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        })
        .catch((err) => alert(err));
    },
    downloadImg(responseUrl) {
      axios({
        method: "GET",
        url: responseUrl, //
        responseType: "blob",
        config: {
          headers: {
            "Access-Control-Allow-Origin": "*",
            Accept: "image/*",
          },
        },
      })
        .then(function (response) {
          const lastItem = responseUrl.substring(
            responseUrl.lastIndexOf("/") + 1
          );

          const downloadUrl = window.URL.createObjectURL(
            new Blob([response.data])
          );
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.setAttribute("download", lastItem);
          document.body.appendChild(link);
          link.click();
        })
        .catch(function (error) {
          alert(error);
        });
    },
    close() {
      this.$emit("close", false);
    },
  },
};
</script>