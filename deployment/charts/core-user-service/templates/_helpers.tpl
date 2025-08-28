{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "name" -}}
{{- if .Values.service.canary.enabled }}
{{- printf "%s-%s" .Chart.Name .Values.service.canary.name | trunc 63 | trimSuffix "-" -}}
{{- else }}
{{- printf "%s" .Chart.Name | trunc 63 | trimSuffix "-" -}}
{{- end }}
{{- end -}}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}