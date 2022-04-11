

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
          <v-btn color="primary" class="ml-auto" @click="download_btn">
            <!-- <download-csv :data="exportData" :name="`${fileName}.csv`">
              <v-icon dense>mdi-download</v-icon>
              Export
            </download-csv> -->
            Download Images
          </v-btn>

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
                <!-- <div>
                  
                    <img
                      :src="item.filename"
                      style="width: 50px; height: 50px"
                      @click="downloadImage(item.filename)"
                    />
                 

                </div> -->
                <div class="images" v-viewer>
                  <img
                    style="width: 50px; height: 50px"
                    :src="item.filename"
                    :key="item.filename"
                  />
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
import { saveAs } from "file-saver";
import axios from "axios";
//import moment from "moment";
import "viewerjs/dist/viewer.css";
import JsZip from "jszip";

//import saveAs() from file-saver;
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
    exportData: [],
    fileName: "",
    Timages: {},
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
          const newArr = res.data.photoType;
          this.Timages = newArr;
          // let exportData = res.data.photoType.map((item) => {
          //   return {
          //     Subscriber_Name:
          //       this.IData.firstName.toUpperCase() +
          //       " " +
          //       this.IData.lastName.toUpperCase(),
          //     Reference_No: this.Rdata.preferenceNo,
          //     Name: item.NAME,
          //     Code: item.code,
          //     Image: item.filename,
          //     " Date": item.dtcreated
          //       ? moment(item.dtcreated).format("MMMM DD, YYYY hh:mm:ss")
          //       : "",
          //   };
          // });
          // this.fileName = `Ibas_photo_${moment(moment().toDate()).format(
          //   "MMM_DD_YYYY"
          // )}`;
          // this.exportData = exportData;
          this.fileName =
            this.IData.firstName.toUpperCase() +
            "_" +
            this.IData.lastName.toUpperCase() +
            "_" +
            this.IData.account.jo_no +
            ".zip";
        });
      console.log(this.Timages);
      //this.loadPhoto();
    },
  },
  methods: {
    downloadImage(url) {
      //var FileSaver = require('file-saver');
      const filename = url.split("/").pop();
      // FileSaver.saveAs(url, filename);

      saveAs(url, filename);
      // fetch(url)
      //   .then((resp) => resp.blob())
      //   .then((blob) => {
      //     const url = window.URL.createObjectURL(blob);
      //     const a = document.createElement("a");
      //     a.style.display = "none";
      //     a.href = url;
      //     // the filename you want
      //     a.download = filename;
      //     document.body.appendChild(a);
      //     a.click();
      //     window.URL.revokeObjectURL(url);
      //   })
      //   .catch((err) => alert(err));
    },
    downloadImg(responseUrl) {
      // this.responseUrl="https://localhost:5001/Photo/986986796_P01.jpg";
      //debugger
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
   async  download_btn() {
      var zip = new JsZip();
      var img = zip.folder("images");
      let fileDownload = this.fileName;
      for (let i = 0; i < this.Timages.length; i++) {
          const lastItem = this.Timages[i].filename.substring(
            this.Timages[i].filename.lastIndexOf("/") + 1
          );

    // Fetch the image and parse the response stream as a blob
    const imageBlob = await fetch(this.Timages[i].filename).then(response => response.blob());

    // create a new file from the blob object
    const imgData = new File([imageBlob], lastItem);
        if (this.Timages[i].filename != "") {
          img.file(lastItem, imgData, { base64: true });
        }
      }
      zip
        .generateAsync({
          type: "blob",
        })
        .then(function (content) {
          saveAs(content, fileDownload);
        });
    },
  },
};
</script>

