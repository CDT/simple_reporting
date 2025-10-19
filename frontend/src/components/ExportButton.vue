<template>
  <div class="flex items-center space-x-2">
    <button
      @click="exportToExcel"
      :disabled="!hasData || isExporting"
      class="btn btn-success flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg v-if="!isExporting" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <div v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      <span>{{ isExporting ? 'Exporting...' : 'Export to Excel' }}</span>
    </button>

    <button
      @click="exportFormatted"
      :disabled="!hasData || isExporting"
      class="btn btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg v-if="!isExporting" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
      </svg>
      <div v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      <span>{{ isExporting ? 'Exporting...' : 'Export Formatted' }}</span>
    </button>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import axios from 'axios'

export default {
  name: 'ExportButton',
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
