
import React, { useState } from 'react';
import { FileUploadSection } from '@/components/FileUploadSection';
import { DataPreview } from '@/components/DataPreview';
import { ReportGenerator } from '@/components/ReportGenerator';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileSpreadsheet, Users, Package } from 'lucide-react';

export interface SurgicalMapData {
  patient: string;
  procedure: string;
  date: string;
  surgeon: string;
  [key: string]: any;
}

export interface OPMEData {
  material: string;
  code: string;
  procedure: string;
  cost: number;
  [key: string]: any;
}

export interface CombinedReport {
  patient: string;
  procedure: string;
  date: string;
  surgeon: string;
  materials: OPMEData[];
  totalCost: number;
}

const Index = () => {
  const [surgicalMapData, setSurgicalMapData] = useState<SurgicalMapData[]>([]);
  const [opmeData, setOpmeData] = useState<OPMEData[]>([]);
  const [combinedReport, setCombinedReport] = useState<CombinedReport[]>([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FileSpreadsheet className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">
              Analisador de Mapa Cirúrgico TASY
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ferramenta para relacionar mapas cirúrgicos com materiais OPME e gerar relatórios detalhados
          </p>
        </div>

        {/* File Upload Section */}
        <Card className="mb-8 p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <Package className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-semibold text-gray-800">Upload de Arquivos</h2>
          </div>
          <FileUploadSection
            onSurgicalMapData={setSurgicalMapData}
            onOpmeData={setOpmeData}
          />
        </Card>

        {/* Data Preview Section */}
        {(surgicalMapData.length > 0 || opmeData.length > 0) && (
          <Card className="mb-8 p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-800">Visualização dos Dados</h2>
            </div>
            <DataPreview
              surgicalMapData={surgicalMapData}
              opmeData={opmeData}
            />
          </Card>
        )}

        {/* Report Generator Section */}
        {surgicalMapData.length > 0 && opmeData.length > 0 && (
          <Card className="p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <FileSpreadsheet className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-800">Geração de Relatório</h2>
            </div>
            <ReportGenerator
              surgicalMapData={surgicalMapData}
              opmeData={opmeData}
              onReportGenerated={setCombinedReport}
              combinedReport={combinedReport}
            />
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
