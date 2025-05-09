
export interface LegislationDocument {
  id: string;
  title: string;
  description: string;
  documentType: string;
  url: string;
  agency: string;
  year: number;
  number?: string;
  tags: string[];
}

// Default legislation documents
const defaultLegislations: LegislationDocument[] = [
  {
    id: '1',
    title: 'Resolução ANA/ANEEL 127/2022',
    description: 'Resolução conjunta que estabelece as diretrizes para o monitoramento hidrológico de usinas hidrelétricas.',
    documentType: 'pdf',
    url: '/assets/legislation/resolucao_ana_aneel_127_2022.pdf',
    agency: 'ANA',
    year: 2022,
    number: '127',
    tags: ['monitoramento', 'hidrelétrica', 'ANA', 'ANEEL']
  },
  {
    id: '2',
    title: 'Anexo I - Resolução ANA/ANEEL 127/2022',
    description: 'Anexo I da Resolução conjunta que estabelece as diretrizes para o monitoramento hidrológico.',
    documentType: 'pdf',
    url: '/assets/legislation/anexo_i_resolucao_ana_aneel_127_2022.pdf',
    agency: 'ANA',
    year: 2022,
    number: '127',
    tags: ['anexo', 'monitoramento', 'hidrelétrica']
  },
  {
    id: '3',
    title: 'Guia MMA - Monitoramento Hidrológico',
    description: 'Guia do Ministério do Meio Ambiente sobre monitoramento hidrológico de usinas hidrelétricas',
    documentType: 'pdf',
    url: '/assets/legislation/guia_mma_monitoramento.pdf',
    agency: 'MMA',
    year: 2022,
    tags: ['guia', 'monitoramento', 'hidrelétrica', 'MMA']
  },
  // Additional documents for online search
  {
    id: '4',
    title: 'Manual de Monitoramento - ANA',
    description: 'Manual técnico para implementação de sistemas de monitoramento hidrológico',
    documentType: 'pdf',
    url: '/assets/legislation/manual_monitoramento_ana.pdf',
    agency: 'ANA',
    year: 2023,
    tags: ['manual', 'monitoramento', 'hidrelétrica', 'ANA']
  },
  {
    id: '5',
    title: 'Portaria MMA 256/2022',
    description: 'Portaria que regulamenta aspectos ambientais para usinas hidrelétricas',
    documentType: 'pdf',
    url: '/assets/legislation/portaria_mma_256_2022.pdf',
    agency: 'MMA',
    year: 2022,
    number: '256',
    tags: ['portaria', 'ambiental', 'hidrelétrica', 'MMA']
  }
];

/**
 * Fetches all legislation documents from the API.
 */
export const fetchLegislationDocuments = async (): Promise<LegislationDocument[]> => {
  try {
    // In a real implementation, this would be an API call
    // For now, just return our static data with a simulated delay
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(defaultLegislations);
      }, 500);
    });
  } catch (error) {
    console.error('Error fetching legislation documents:', error);
    return [];
  }
};

/**
 * Searches for legislation documents online.
 */
export const searchOnlineForLegislation = async (query: string): Promise<LegislationDocument[]> => {
  try {
    // Simulate an online search by filtering our local data
    const lowerQuery = query.toLowerCase();
    const filteredDocs = defaultLegislations.filter(doc => 
      doc.title.toLowerCase().includes(lowerQuery) || 
      doc.description.toLowerCase().includes(lowerQuery) ||
      doc.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
    
    // Add a delay to simulate network request
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(filteredDocs);
      }, 1500);
    });
  } catch (error) {
    console.error('Error searching for legislation:', error);
    throw new Error('Failed to search for legislation');
  }
};

/**
 * Downloads a legislation document.
 */
export const downloadLegislationDocument = async (documentToDownload: LegislationDocument): Promise<void> => {
  try {
    // Create a temporary anchor element for the download
    const link = document.createElement('a');
    
    // Set the href and download attributes
    link.href = documentToDownload.url;
    link.download = `${documentToDownload.title}.${documentToDownload.documentType}`;
    
    // Append to the document body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading document:', error);
    throw new Error('Failed to download document');
  }
};
