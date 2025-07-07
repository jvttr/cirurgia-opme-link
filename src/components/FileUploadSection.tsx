
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Upload, FileSpreadsheet, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { SurgicalMapData, OPMEData } from '@/pages/Index';

interface FileUploadSectionProps {
  onSurgicalMapData: (data: SurgicalMapData[]) => void;
  onOpmeData: (data: OPMEData[]) => void;
}

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  onSurgicalMapData,
  onOpmeData,
}) => {
  const [surgicalMapUploaded, setSurgicalMapUploaded] = React.useState(false);
  const [opmeUploaded, setOpmeUploaded] = React.useState(false);

  const processExcelFile = useCallback((file: File, type: 'surgical' | 'opme') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        console.log(`Dados brutos processados (${type}):`, jsonData);

        if (type === 'surgical') {
          // Filter rows where column D (patient) is not empty AND column C (attendance) is not "Pront."
          const filteredData = jsonData.filter((row: any[]) => {
            const patient = row[3] ? row[3].toString().trim() : '';
            const attendance = row[2] ? row[2].toString().trim() : '';
            return patient !== '' && attendance !== 'Pront.' && attendance !== '';
          });

          console.log('Dados filtrados do mapa cirúrgico:', filteredData);

          // Skip header row and convert to objects
          const dataRows = filteredData.slice(1);

          const surgicalData: SurgicalMapData[] = dataRows.map((row: any[]) => ({
            attendance: row[2] ? row[2].toString().trim() : 'N/A', // Column C
            patient: row[3] ? row[3].toString().trim() : 'N/A', // Column D
            dateTime: row[1] ? row[1].toString().trim() : 'N/A', // Column B
            surgery: row[5] ? row[5].toString().trim() : 'N/A', // Column F
            surgeon: row[7] ? row[7].toString().trim() : 'N/A', // Column H
            originalRow: row
          }));

          onSurgicalMapData(surgicalData);
          setSurgicalMapUploaded(true);
          toast({
            title: "Mapa Cirúrgico Carregado",
            description: `${surgicalData.length} registros processados com sucesso.`,
          });
        } else {
          // For OPME data, filter non-empty rows and group by attendance
          const filteredData = jsonData.filter((row: any[]) => {
            return row && row[3] && row[3].toString().trim() !== '';
          });

          console.log('Dados filtrados OPME:', filteredData);

          // Skip header row and convert to objects
          const dataRows = filteredData.slice(1);

          // Group materials by attendance
          const opmeMap = new Map<string, { materials: string[], quantities: number[] }>();

          dataRows.forEach((row: any[]) => {
            const attendance = row[3] ? row[3].toString().trim() : '';
            const material = row[6] ? row[6].toString().trim() : 'N/A'; // Column G
            const quantity = row[8] ? parseFloat(row[8].toString()) || 1 : 1; // Column I

            if (attendance && material !== 'N/A') {
              if (!opmeMap.has(attendance)) {
                opmeMap.set(attendance, { materials: [], quantities: [] });
              }
              const entry = opmeMap.get(attendance)!;
              entry.materials.push(material);
              entry.quantities.push(quantity);
            }
          });

          // Convert grouped data to array
          const opmeDataProcessed: OPMEData[] = [];
          opmeMap.forEach((value, attendance) => {
            value.materials.forEach((material, index) => {
              opmeDataProcessed.push({
                attendance,
                material,
                quantity: value.quantities[index],
                originalRow: []
              });
            });
          });

          onOpmeData(opmeDataProcessed);
          setOpmeUploaded(true);
          toast({
            title: "Dados OPME Carregados",
            description: `${opmeDataProcessed.length} materiais processados e agrupados por atendimento.`,
          });
        }
      } catch (error) {
        console.error('Erro ao processar arquivo:', error);
        toast({
          title: "Erro no Processamento",
          description: "Erro ao processar o arquivo. Verifique se é um arquivo Excel válido.",
          variant: "destructive",
        });
      }
    };
    reader.readAsBinaryString(file);
  }, [onSurgicalMapData, onOpmeData]);

  const onDropSurgical = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      processExcelFile(file, 'surgical');
    }
  }, [processExcelFile]);

  const onDropOpme = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      processExcelFile(file, 'opme');
    }
  }, [processExcelFile]);

  const { getRootProps: getSurgicalRootProps, getInputProps: getSurgicalInputProps, isDragActive: isSurgicalDragActive } = useDropzone({
    onDrop: onDropSurgical,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    multiple: false,
  });

  const { getRootProps: getOpmeRootProps, getInputProps: getOpmeInputProps, isDragActive: isOpmeDragActive } = useDropzone({
    onDrop: onDropOpme,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    multiple: false,
  });

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Surgical Map Upload */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <FileSpreadsheet className="h-5 w-5 mr-2 text-blue-600" />
          Mapa Cirúrgico TASY
        </h3>
        <div
          {...getSurgicalRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isSurgicalDragActive
              ? 'border-blue-400 bg-blue-50'
              : surgicalMapUploaded
              ? 'border-green-400 bg-green-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          }`}
        >
          <input {...getSurgicalInputProps()} />
          <div className="flex flex-col items-center">
            {surgicalMapUploaded ? (
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            ) : (
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
            )}
            <p className="text-sm text-gray-600 mb-2">
              {surgicalMapUploaded
                ? 'Mapa cirúrgico carregado com sucesso!'
                : isSurgicalDragActive
                ? 'Solte o arquivo aqui...'
                : 'Arraste o arquivo .xls do mapa cirúrgico ou clique para selecionar'}
            </p>
            <p className="text-xs text-gray-500 mb-2">
              (Colunas: C-Atendimento, D-Paciente, B-Data/Hora, F-Cirurgia, H-Cirurgião)
            </p>
            <Button variant="outline" size="sm">
              Selecionar Arquivo
            </Button>
          </div>
        </div>
      </Card>

      {/* OPME Data Upload */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <FileSpreadsheet className="h-5 w-5 mr-2 text-green-600" />
          Relatório de Materiais OPME
        </h3>
        <div
          {...getOpmeRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isOpmeDragActive
              ? 'border-green-400 bg-green-50'
              : opmeUploaded
              ? 'border-green-400 bg-green-50'
              : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
          }`}
        >
          <input {...getOpmeInputProps()} />
          <div className="flex flex-col items-center">
            {opmeUploaded ? (
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            ) : (
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
            )}
            <p className="text-sm text-gray-600 mb-2">
              {opmeUploaded
                ? 'Relatório OPME carregado com sucesso!'
                : isOpmeDragActive
                ? 'Solte o arquivo aqui...'
                : 'Arraste o arquivo .xls de materiais OPME ou clique para selecionar'}
            </p>
            <p className="text-xs text-gray-500 mb-2">
              (Colunas: D-Atendimento, G-Material, I-Quantidade)
            </p>
            <Button variant="outline" size="sm">
              Selecionar Arquivo
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
