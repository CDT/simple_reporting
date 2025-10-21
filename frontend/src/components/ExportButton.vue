<template>
  <div class="flex items-center space-x-2">
    <button
      @click="exportToExcel"
      :disabled="!hasData || isExporting"
      class="btn btn-success flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <DownloadIcon v-if="!isExporting" class="w-4 h-4" />
      <div v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      <span>{{ isExporting ? 'Exporting...' : 'Export to Excel' }}</span>
    </button>

    <button
      @click="exportFormatted"
      :disabled="!hasData || isExporting"
      class="btn btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <FormattedExportIcon v-if="!isExporting" class="w-4 h-4" />
      <div v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      <span>{{ isExporting ? 'Exporting...' : 'Export Formatted' }}</span>
    </button>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import axios from 'axios'
import { DownloadIcon, FormattedExportIcon } from './ui/icons'

export default {
  name: 'ExportButton',
  components: {
    DownloadIcon,
    FormattedExportIcon
  },
  props: {
    sql: {
      type: String,
      required: true
    },
    params: {
      type: Array,
      default: () => []
    },
    filename: {
      type: String,
      default: 'report'
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const isExporting = ref(false)

    const hasData = computed(() => {
      return props.data && props.data.length > 0
    })

    const exportToExcel = async () => {
      if (!props.sql) {
        alert('No SQL query provided')
        return
      }

      isExporting.value = true

      try {
        const response = await axios.post('/api/export/excel', {
          sql: props.sql,
          params: props.params,
          filename: props.filename
        }, {
          responseType: 'blob'
        })

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${props.filename}.xlsx`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)

      } catch (error) {
        console.error('Export error:', error)
        alert('Export failed: ' + (error.response?.data?.message || error.message))
      } finally {
        isExporting.value = false
      }
    }

    const exportFormatted = async () => {
      if (!props.sql) {
        alert('No SQL query provided')
        return
      }

      isExporting.value = true

      try {
        const response = await axios.post('/api/export/excel/formatted', {
          sql: props.sql,
          params: props.params,
          filename: props.filename
        }, {
          responseType: 'blob'
        })

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${props.filename}_formatted.xlsx`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)

      } catch (error) {
        console.error('Formatted export error:', error)
        alert('Export failed: ' + (error.response?.data?.message || error.message))
      } finally {
        isExporting.value = false
      }
    }

    return {
      isExporting,
      hasData,
      exportToExcel,
      exportFormatted
    }
  }
}
</script>
