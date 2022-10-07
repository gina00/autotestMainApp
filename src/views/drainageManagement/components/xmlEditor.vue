<template>
  <codemirror ref="cmEditor" :value="formatCode" :options="cmOptions" @ready="onCmReady" />
</template>

<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/theme/idea.css'
import 'codemirror/addon/lint/json-lint'
import 'codemirror/addon/hint/show-hint.css'

import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/comment-fold'

import 'codemirror/mode/xml/xml.js'
import 'codemirror/mode/htmlmixed/htmlmixed.js'
import 'codemirror/addon/hint/xml-hint.js'
import 'codemirror/addon/hint/html-hint.js'
import 'codemirror/addon/fold/xml-fold.js'
import 'codemirror/addon/lint/lint.css'
// import 'codemirror/addon/lint/html-lint.js'
var format = require('xml-formatter')
export default {
  name: 'XmlEditor',
  components: { codemirror },
  /* eslint-disable vue/require-prop-types */
  props: {
    code: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      formatCode: '',
      dataClone: '',
      cmOptions: {
        // codemirror options
        tabSize: 4,
        mode: 'application/xml',
        theme: 'idea',
        lineNumbers: true,
        line: true,
        readOnly: true,
        foldGutter: true,
        lineWrapping: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers']
        // more codemirror options, 更多 codemirror 的高级配置...
      }
    }
  },
  computed: {
    codemirror() {
      return this.$refs.cmEditor.codemirror
    }
  },
  watch: {
    code: {
      deep: true,
      handler(newVal, oldVal) {
        this.initData()
      }
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    onCmReady(cm) {
      setTimeout(() => {
        this.$refs.cmEditor.refresh()
      }, 50)
    },
    initData() {
      if (!this.code) {
        return
      }
      if (this.code == '<?xml version="1.0" encoding="GBK"?>') {
        this.formatCode = this.code
      } else {
        this.formatCode = format(this.code, {
          indentation: '  ',
          filter: node => node.type !== 'Comment',
          collapseContent: true,
          lineSeparator: '\n'
        })
      }

      setTimeout(() => {
        this.$refs.cmEditor.refresh()
      }, 50)
    }
  }
}
</script>

<style lang="scss" scoped>
.json-editor {
  height: 100%;
  position: relative;
  ::v-deep {
    .CodeMirror {
      height: auto;
      min-height: 300px;
    }
    .CodeMirror-scroll {
      min-height: 300px;
    }
    .cm-s-rubyblue span.cm-string {
      color: #f08047;
    }
  }
}
</style>
