
import React, { useState } from 'react';
import { FileUploadSection } from '@/components/FileUploadSection';
import { DataPreview } from '@/components/DataPreview';
import { ReportGenerator } from '@/components/ReportGenerator';
import { AuthForm } from '@/components/AuthForm';
import { Header } from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Package, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export interface SurgicalMapData {
  attendance: string;
  patient: string;
  dateTime: string;
  surgeon: string;
  [key: string]: any;
}

export interface OPMEData {
  attendance: string;
  material: string;
  quantity: number;
  [key: string]: any;
}

export interface CombinedReport {
  attendance: string;
  patient: string;
  dateTime: string;
  surgeon: string;
  materials: OPMEData[];
  totalQuantity: number;
}

const Index = () => {
  const { user, loading } = useAuth();
  const [surgicalMapData, setSurgicalMapData] = useState<SurgicalMapData[]>([]);
  const [opmeData, setOpmeData] = useState<OPMEData[]>([]);
  const [combinedReport, setCombinedReport] = useState<CombinedReport[]>([]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onAuthSuccess={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <div className="container mx-auto py-8 px-4">
        {/* Description */}
        <div className="text-center mb-8">
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ferramenta para relacionar mapas cirúrgicos com materiais OPME por número de atendimento
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
              <Package className="h-6 w-6 text-blue-600 mr-2" />
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
