export interface Service {
  id: number;
  name: string;
  profession: number;
}

export interface Option {
  id: number;
  name: string;
  services: Service[];
}

export interface ProfessionalAreaSelectProps {
  value: Option | null;
  onChange: (value: Option | null) => void;
  options: Option[];
}


export interface ServiceSelectProps {
  value: Service[]; 
  onChange: (value: Service[]) => void;
  allServices: Service[];
}


export interface Service {
  id: number;
  name: string;
  profession: number;
}

export interface Profession {
  id: number;
  name: string;
  services: Service[];
}

export interface ProfessionalArea {
  id: number;
  name: string;
  professions: Profession[]; 
  services: Service[];

}


export interface ProfessionalServiceSelectProps {
  areas: ProfessionalArea[];
  onSelect: (service: Service) => void;
  selectedService: Service | null;
}

export interface ProfessionalProfile {
  id: number;
  professional_area: ProfessionalArea;
  profession: Profession;
  services: Service[];
}