
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { SurgicalMapData, OPMEData } from '@/pages/Index';
import { Calendar, User, Stethoscope, Package2, Hash, Activity } from 'lucide-react';

interface DataPreviewProps {
  surgicalMapData: SurgicalMapData[];
  opmeData: OPMEData[];
}

export const DataPreview: React.FC<DataPreviewProps> = ({
  surgicalMapData,
  opmeData,
}) => {
  return (
    <Tabs defaultValue="surgical" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="surgical" className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          Mapa Cirúrgico ({surgicalMapData.length})
        </TabsTrigger>
        <TabsTrigger value="opme" className="flex items-center">
          <Package2 className="h-4 w-4 mr-2" />
          Materiais OPME ({opmeData.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="surgical" className="mt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Dados do Mapa Cirúrgico
          </h3>
          {surgicalMapData.length === 0 ? (
            <p className="text-gray-500">Nenhum dado carregado</p>
          ) : (
            <div className="grid gap-4">
              {surgicalMapData.slice(0, 5).map((item, index) => (
                <Card key={index} className="p-4 bg-blue-50 border-blue-200">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Hash className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="font-medium">Atendimento:</span>
                        <span className="ml-1">{item.attendance}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="font-medium">Paciente:</span>
                        <span className="ml-1">{item.patient}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="font-medium">Data/Hora:</span>
                        <span className="ml-1">{item.dateTime}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Activity className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="font-medium">Cirurgia:</span>
                        <span className="ml-1">{item.surgery}</span>
                      </div>
                      <div className="flex items-center">
                        <Stethoscope className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="font-medium">Cirurgião:</span>
                        <span className="ml-1">{item.surgeon}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              {surgicalMapData.length > 5 && (
                <Badge variant="secondary" className="w-fit">
                  +{surgicalMapData.length - 5} registros adicionais
                </Badge>
              )}
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="opme" className="mt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Dados de Materiais OPME
          </h3>
          {opmeData.length === 0 ? (
            <p className="text-gray-500">Nenhum dado carregado</p>
          ) : (
            <div className="grid gap-4">
              {opmeData.slice(0, 5).map((item, index) => (
                <Card key={index} className="p-4 bg-green-50 border-green-200">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Hash className="h-4 w-4 text-green-600 mr-2" />
                        <span className="font-medium">Atendimento:</span>
                        <span className="ml-1">{item.attendance}</span>
                      </div>
                      <div className="flex items-center">
                        <Package2 className="h-4 w-4 text-green-600 mr-2" />
                        <span className="font-medium">Material:</span>
                        <span className="ml-1">{item.material}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="font-medium">Quantidade:</span>
                        <Badge variant="secondary" className="ml-1">
                          {item.quantity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              {opmeData.length > 5 && (
                <Badge variant="secondary" className="w-fit">
                  +{opmeData.length - 5} materiais adicionais
                </Badge>
              )}
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};
