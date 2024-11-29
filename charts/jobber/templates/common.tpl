{{- define "common.env" -}}
- name: PULSAR_SERVICE_URL
  value: {{ .Values.global.pulsarServiceUrl | quote }}
- name: DATABASE_URL
  value: {{ .Values.global.postgresConnectionString | quote }}
{{- end -}}