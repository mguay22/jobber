{{- define "common.env" -}}
- name: PULSAR_SERVICE_URL
  value: {{ .Values.global.pulsarServiceUrl | quote }}
- name: DATABASE_URL
  value: postgresql://postgres:postgres@{{ .Release.Name }}-postgresql.postgresql.svc.cluster.local:5432/jobber
{{- end -}}