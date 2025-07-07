
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Download, FileSpreadsheet, Calculator, User, Package2, Hash, Activity } from 'lucide-react';
import * as XLSX from 'xlsx';
import { SurgicalMapData, OPMEData, CombinedReport } from '@/pages/Index';

interface ReportGeneratorProps {
  surgicalMapData: SurgicalMapData[];
  opmeData: OPMEData[];
  onReportGenerated: (report: CombinedReport[]) => void;
  combinedReport: CombinedReport[];
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  surgicalMapData,
  opmeData,
  onReportGenerated,
  combinedReport,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = () => {
    setIsGenerating(true);
    
    try {
      console.log('Gerando relatório...');
      console.log('Dados cirúrgicos:', surgicalMapData);
      console.log('Dados OPME:', opmeData);

      const report: CombinedReport[] = surgicalMapData.map(surgery => {
        // Match materials OPME by attendance number
        const relatedMaterials = opmeData.filter(material => 
          material.attendance === surgery.attendance
        );

        const totalQuantity = relatedMaterials.reduce((sum, material) => sum + (material.quantity || 0), 0);

        console.log(`Atendimento: ${surgery.attendance}, Materiais encontrados: ${relatedMaterials.length}`);

        return {
          attendance: surgery.attendance,
          patient: surgery.patient,
          dateTime: surgery.dateTime,
          surgery: surgery.surgery,
          surgeon: surgery.surgeon,
          materials: relatedMaterials,
          totalQuantity: totalQuantity
        };
      });

      onReportGenerated(report);
      
      toast({
        title: "Relatório Gerado",
        description: `Relatório combinado criado com ${report.length} atendimentos.`,
      });
      
      console.log('Relatório gerado:', report);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast({
        title: "Erro na Geração",
        description: "Erro ao gerar o relatório combinado.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const exportToExcel = () => {
    if (combinedReport.length === 0) {
      toast({
        title: "Nenhum Relatório",
        description: "Gere o relatório antes de exportar.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Prepare data for export
      const exportData = combinedReport.flatMap(report => 
        report.materials.length > 0 
          ? report.materials.map(material => ({
              'Atendimento': report.attendance,
              'Paciente': report.patient,
              'Data/Hora': report.dateTime,
              'Cirurgia': report.surgery,
              'Cirurgião': report.surgeon,
              'Material OPME': material.material,
              'Quantidade': material.quantity,
              'Quantidade Total Atendimento': report.totalQuantity
            }))
          : [{
              'Atendimento': report.attendance,
              'Paciente': report.patient,
              'Data/Hora': report.dateTime,
              'Cirurgia': report.surgery,
              'Cirurgião': report.surgeon,
              'Material OPME': 'Nenhum material relacionado',
              'Quantidade': 0,
              'Quantidade Total Atendimento': 0
            }]
      );

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório OPME');

      // Set column widths
      const colWidths = [
        { wch: 15 }, // Atendimento
        { wch: 25 }, // Paciente
        { wch: 20 }, // Data/Hora
        { wch: 30 }, // Cirurgia
        { wch: 25 }, // Cirurgião
        { wch: 40 }, // Material OPME
        { wch: 12 }, // Quantidade
        { wch: 20 }, // Quantidade Total Atendimento
      ];
      worksheet['!cols'] = colWidths;

      const fileName = `relatorio_opme_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      toast({
        title: "Relatório Exportado",
        description: `Arquivo ${fileName} baixado com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast({
        title: "Erro na Exportação",
        description: "Erro ao exportar o relatório.",
        variant: "destructive",
      });
    }
  };

  const totalAttendances = combinedReport.length;
  const totalMaterials = combinedReport.reduce((sum, report) => sum + report.materials.length, 0);
  const totalQuantity = combinedReport.reduce((sum, report) => sum + report.totalQuantity, 0);

  return (
    <div className="space-y-6">
      {/* Generate Report Button */}
      <div className="flex gap-4">
        <Button
          onClick={generateReport}
          disabled={isGenerating}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Calculator className="h-4 w-4 mr-2" />
          {isGenerating ? 'Gerando...' : 'Gerar Relatório Combinado'}
        </Button>
        
        {combinedReport.length > 0 && (
          <Button
            onClick={exportToExcel}
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar Excel
          </Button>
        )}
      </div>

      {/* Report Summary */}
      {combinedReport.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Atendimentos</p>
                <p className="text-2xl font-bold text-blue-800">{totalAttendances}</p>
              </div>
              <Hash className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Materiais OPME</p>
                <p className="text-2xl font-bold text-green-800">{totalMaterials}</p>
              </div>
              <Package2 className="h-8 w-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-4 bg-purple-50 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Quantidade Total</p>
                <p className="text-2xl font-bold text-purple-800">{totalQuantity}</p>
              </div>
              <Calculator className="h-8 w-8 text-purple-600" />
            </div>
          </Card>
        </div>
      )}

      {/* Report Preview */}
      {combinedReport.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <FileSpreadsheet className="h-5 w-5 mr-2" />
            Prévia do Relatório Combinado (Relacionamento por Atendimento)
          </h3>
          
          <div className="grid gap-4 max-h-96 overflow-y-auto">
            {combinedReport.slice(0, 10).map((report, index) => (
              <Card key={index} className="p-4 border-l-4 border-l-blue-500">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Hash className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="font-medium">Atendimento:</span>
                      <span className="ml-1">{report.attendance}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="font-medium">Paciente:</span>
                      <span className="ml-1">{report.patient}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">Data/Hora:</span>
                      <span className="ml-1">{report.dateTime}</span>
                    </div>
                    <div className="flex items-center">
                      <Activity className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="font-medium">Cirurgia:</span>
                      <span className="ml-1">{report.surgery}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Package2 className="h-4 w-4 text-green-600 mr-2" />
                      <span className="font-medium">Materiais:</span>
                      <Badge variant="secondary" className="ml-2">
                        {report.materials.length}
                      </Badge>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">Quantidade Total:</span>
                      <Badge 
                        variant={report.totalQuantity > 0 ? "default" : "secondary"} 
                        className="ml-2"
                      >
                        {report.totalQuantity}
                      </Badge>
                    </div>
                    {report.materials.length > 0 && (
                      <div className="text-xs text-gray-600">
                        <p>Principais materiais:</p>
                        <ul className="list-disc list-inside ml-2">
                          {report.materials.slice(0, 2).map((material, i) => (
                            <li key={i}>{material.material} ({material.quantity})</li>
                          ))}
                          {report.materials.length > 2 && (
                            <li>+{report.materials.length - 2} outros...</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
            
            {combinedReport.length > 10 && (
              <Badge variant="secondary" className="w-fit mx-auto">
                +{combinedReport.length - 10} registros adicionais no relatório completo
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
