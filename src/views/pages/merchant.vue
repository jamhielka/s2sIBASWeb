<template>



  <v-data-table
    :headers="headers"
    :items="desserts"
    sort-by="name"
    item-key="_id"
    class="elevation-1"

  
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Merchant</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
             <v-icon class="mr-2">mdi-plus-circle</v-icon> Add Merchant
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Add Merchant</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                  
                  >
                    <v-text-field
                      v-model="editedItem.name"
                      label="Name"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                  
                  >
                    <v-text-field
                      v-model="editedItem.emailAddress"
                      label="Email Address"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                  
                  >
                    <v-text-field
                      v-model="editedItem.contactPerson"
                      label="Contact Person"
                    ></v-text-field>
                     <v-text-field
                      v-model="editedItem.contactNumber"
                      label="Contact Number"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                   
                  >
                    <v-text-field
                      v-model="editedItem.password"
                      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required, rules.min]"
            :type="show1 ? 'text' : 'password'"
            name="input-10-1"
            label="Password"
            hint="At least 8 characters"
            counter
            @click:append="show1 = !show1"
                      
                    ></v-text-field>
                  </v-col>
                 <v-col>
                   <v-file-input
                    truncate-length="15"
                    label="Merchant Logo"
                  q></v-file-input>
                 </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
         <v-dialog
          v-model="dialogEdit"
          max-width="500px"
        >
       
          <v-card>
            <v-card-title>
              <span class="text-h5">Edit Merchant</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                  
                  >
                    <v-text-field
                      v-model="editedItem.name"
                      label="Name"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                  
                  >
                    <v-text-field
                      v-model="editedItem.emailAddress"
                      label="Email Address"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                  
                  >
                    <v-text-field
                      v-model="editedItem.contactPerson"
                      label="Contact Person"
                    ></v-text-field>
                     <v-text-field
                      v-model="editedItem.contactNumber"
                      label="Contact Number"
                    ></v-text-field>
                  </v-col>
               
                 <v-col>
                   <v-file-input
                    truncate-length="15"
                    label="Merchant Logo"
                  q></v-file-input>
                 </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="closeEdit"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="saveEdit"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>


      </v-toolbar>
    </template>
    <template  v-slot:[`item.actions`]="{ item }">
     
     
      <v-icon
        small
        class="mr-2" 
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
        <v-icon
        small
        @click="listItem(item)"
      >
        mdi-format-list-bulleted
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
      
    </template>
    <!--<template v-slot:no-data>
      <v-btn
        color="primary"
        @click="initialize"
      >
        Reset
      </v-btn>
    </template>-->
  </v-data-table>
</template>

<script>

  export default {
    data: () => ({
      dialog: false,
      dialogDelete: false,
      dialogEdit:false,
      show1: false,
       password: 'Password',
      headers: [
        {
          text: 'Merchant Name',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Email Address', value: 'emailAddress' },
        { text: 'Contact Person', value: 'contactPerson' },
        { text: 'Contact Number', value: 'contactNumber' },
        
          { text: 'Actions', value: 'actions', sortable: false },

      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        emailAddress: '',
        contactPerson: '',
        contactNumber: '',
        password: '',
      },
      defaultItem: {
      name: '',
        emailAddress: '',
        contactPerson: '',
        contactNumber: '',
        password: '',
      },
       rules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 8 || 'Min 8 characters',
          emailMatch: () => (`The email and password you entered don't match`),
        },
       
       
      
    }),

    computed: {
      //formTitle () {
      //  return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
     // },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created () {
       this.getForMerchantList();
    },

    methods: {
     async getForMerchantList() {
     // this.table.loading = true;
      var TToken=localStorage.getItem('token');
       //console.log(TToken);
      await this.$api
        .get("merchants",{
            headers:{
                'wsc-token':TToken
            }

        })

        .then((response) => {
          console.log(response)
          const newArr = response.data.data.merchants;
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
      editItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogEdit = true
      },

      deleteItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.desserts.splice(this.editedIndex, 1)
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
  closeEdit () {
        this.dialogEdit = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
       save () {
        if (this.editedIndex > -1) {
          Object.assign(this.desserts[this.editedIndex], this.editedItem)
        } else {
          //this.desserts.push(this.editedItem)
        var TToken=localStorage.getItem('token');

        var data = {
            'name':this.editedItem.name,
          'emailAddress':this.editedItem.emailAddress,
          'contactPerson':this.editedItem.contactPerson,
          'contactNumber':this.editedItem.contactNumber,
         'password' :this.editedItem.password
        }
     //console.log(data);
       //console.log(TToken);
       this.$api.post("merchants",data,{ headers:{
                'wsc-token':TToken
            }

         
        })

        .then((response) => {
          console.log(response)
         this.refeshData();
          //this.table.loading = false;
        })
        .catch((e) => {
          //this.table.loading = false;
          console.log(e);
        });

        }
        this.close()
      },
        saveEdit () {
        if (this.editedIndex > -1) {
          Object.assign(this.desserts[this.editedIndex], this.editedItem)
        } else {
          //this.desserts.push(this.editedItem)
        var TToken=this.$store.state.token;
          console.log(TToken);
        var data = {
           '_id':this.editedItem._id,
            'name':this.editedItem.name,
     
          'contactPerson':this.editedItem.contactPerson,
          'contactNumber':this.editedItem.contactNumber
     
        }
     //console.log(data);
       //console.log(TToken);
       this.$api.put("merchants",data,{ headers:{
                'wsc-token':TToken
            }

         
        })

        .then((response) => {
          console.log(response)
         this.refeshData();
          //this.table.loading = false;
        })
        .catch((e) => {
          //this.table.loading = false;
          console.log(e);
        });

        }
        this.close()
      },
       listItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
      this.$router.push("/events?ID="+ item._id);
      },
    },
  }
</script>