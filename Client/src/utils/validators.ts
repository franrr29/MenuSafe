 export function validateInput(input: string): string | null {
          const trimmed = input.trim();
          
          if (trimmed.length === 0) {
              return "Ingresa una consulta para continuar";
          }
          if (trimmed.length > 300) {
              return "Debes escribir menos de 300 caracteres";
          }
          return null;
      }