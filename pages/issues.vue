<template>

  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      
      <v-card>
        <v-toolbar color="cyan" dark>
          <v-toolbar-side-icon></v-toolbar-side-icon>

          <v-toolbar-title>Issues</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn icon>
            <v-icon>search</v-icon>
          </v-btn>
        </v-toolbar>

        <v-list three-line>
          <template v-for="(item, index) in items">
            <v-subheader
              v-if="item.header"
              :key="item.header"
            >
              {{ item.header }}
            </v-subheader>

            <v-divider
              v-else-if="item.divider"
              :inset="item.inset"
              :key="index"
            ></v-divider>

            <v-list-tile
              v-else
              :key="item.title"
              avatar
              
            >
              <v-list-tile-avatar>
                <img :src="item.avatar">
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title v-html="item.title"></v-list-tile-title>
                <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-btn
                  depressed
                  :color="item.lockedColor"
                  @click="doLock(item)"
                >
                  {{ item.lockedText }}
                </v-btn>
                <v-btn
                  depressed
                  @click="$nuxt._router.push({ path: 'edit', query: { id: item.number }})"
                >
                  Edit
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </template>
        </v-list>
      </v-card>
      <v-dialog v-model="dialog" persistent max-width="500px">
      <v-btn slot="activator" color="primary" dark>Add</v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">New Issue</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
       
              <v-flex xs12>
                <v-text-field label="Title:" required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Description:" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-select
                  :items="['0-17', '18-29', '30-54', '54+']"
                  label="Age"
                  required
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6>
                <v-autocomplete
                  :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                  label="Interests"
                  multiple
                  chips
                ></v-autocomplete>
              </v-flex>
            </v-layout>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" flat @click.native="dialog = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
  import axios from 'axios'
  export default {
    data () {
      return { items: this.$store.state.issues, dialog: false }
    },
    fetch ({ store, params }) {
      return axios.get('https://api.github.com/repos/rodoflho/rodoflho.github.io/issues')
        .then((res) => {
          var items = []
          res.data.forEach(element => {
            items.push({
              avatar: 'https://cdn2.iconfinder.com/data/icons/large-svg-icons/512/bug_insect_ladybird_animal-512.png',
              title: element.title,
              subtitle: element.body,
              number: element.number,
              lockedColor: element.locked ? 'error' : 'primary',
              lockedText: element.locked ? 'Locked' : 'Unlocked'
            })
          })
          store.commit('setIssues', items)
        })
    },
    methods: {
      doLock: function (issue) {
        var url = `https://api.github.com/repos/rodoflho/rodoflho.github.io/issues/${issue.number}/lock`
        if (issue.lockedText === 'Locked') {
          axios({
            method: 'DELETE',
            url: url,
            headers: {
              'Authorization': 'token e7f207ec7e11f25df4e29b34be462ba85ec317d6',
              'Accept': 'application/vnd.github.the-key-preview'
            }
          })
        } else {
          axios({
            method: 'PUT',
            url: url,
            headers: {
              'Authorization': 'token e7f207ec7e11f25df4e29b34be462ba85ec317d6',
              'Content-Length': 0,
              'Accept': 'application/vnd.github.the-key-preview'
            }
          })
        }
        this.$store.commit('lock', issue)
      }
    }
  }
</script>