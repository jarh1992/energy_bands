from django.shortcuts import render
from django.views.generic import View
import json
from django.http import JsonResponse
import numpy as np


h = 4.135667696e-15  # Constante de Planck [eV⋅s]
ħ = 6.582119569e-16  # Constante reducida de Planck [eV⋅s]
KB = 8.617333262e-5  # Constante de Boltzmann  [eV/K-1]
e = 1.602176634e-19  # Carga elemental [C]
me = 0.51099e6 / (29979245800 ** 2)  # masa del electrón [eV/cm2]
eps0 = 55.263 * (e**2) / 1e-4  # Permitividad del vacío [eV cm]


def varshni_rel(T = 77):
    eg0 = 1.533  # GaAs T=0
    α = 5.5e-4  # eV/K
    β = 198  # K
    egT = eg0 - (α * T**2)/(β + T)
    return egT


def passler(T, x=0):
    eg0 = 1.5176  # GaAs T=0, x=0
    α = 4.6e-4  # eV/K
    Θ = 203  # K
    p = 2.85
    a = 1 + np.power((2 * T / Θ), p)
    egT = eg0 - (α * Θ / 2) * (np.power(a, (1 / p)) - 1)
    return egT


def fermi_energy_level(hem, eem, eg, T = 300.0):
    """
    Fermy energy level (Efi)

    hem: Hole effective mass
    eem: Electron effective mass
    eg: energy band gap
    """
    return (3/4) * KB * T * np.log(hem / eem) + (eg/2)


def effective_density_states(effective_mass, T=300.0):
    """
    Effective Density of States Function

    calcula Intrinsic electron Concentration

    para hallar Intrinsic holes Concentration
    cambiar masa efectiva electron por masa efectiva hueco
    energia de fermi Efi - banda de valencia Ev

    """

    nc = 2 * ((2 * np.pi * effective_mass * KB * 300) / (h**2)) ** (3/2)
    # nc = np.float64(nc)
    # nc = np.format_float_scientific(nc, unique=False, precision=17),
    return nc


def intrinsic_concentration(nc, nh, Eg, T=300.0):
    """
    intrinsic_concentration

    Parameters
    ----------
    nc: Electron effective Density of States
    nh: Hole effective Density of States
    T: temperature

    """

    ni = np.sqrt(nc * nh * np.exp(-Eg / (KB * T)))
    ni = np.format_float_scientific(ni, unique=False, precision=3)
    return ni


# ioffe
GaAs = {
    'eem': 0.067 * me,  # Electron effective mass mo * electron mass me
    'hem': 0.48 * me,  # Hole effective mass mo
    'eaf': 4.07,  # Electron affinity eV
    'eg': lambda T: passler(T)
}

AlGaAs = {
    'eem': lambda x: (0.067 + 0.083 * x) * me,  # Electron effective mass mo * electron mass me
    # 'hem': lambda x: (0.85 - 0.14 * x) * me,  # Hole effective mass mo
    'hem': lambda x: (0.48 - 0.14 * x) * me,  # Hole effective mass mo
    # 'eaf': lambda x: 1.02 * x + 3.05,  # Electron affinity eV
    'eaf': lambda x: 1.02 * x + 4.07,  # Electron affinity eV
    'eg': lambda T, x: passler(T) + 1.2475 * x
}


class Index(View):
    template_name = 'index.html'

    def get_context_data(self, **kwargs):
        ctx = super(Index, self).get_context_data(**kwargs)
        return ctx

    def get(self, request, *args, **kwargs):
        return render(request, 'index.html')

    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        T = float(data['T'])
        c = float(data['C'])
        d = float(data['D'])

        G_Ec = GaAs['eaf']  # electron afinity
        G_Eg = GaAs['eg'](T)  # generar grafica T vs Eg
        G_Ev = G_Ec + G_Eg
        G_Efi = fermi_energy_level(GaAs['hem'], GaAs['eem'], G_Eg, T)
        G_nc_electron = effective_density_states(GaAs['eem'], T)
        G_nc_hole = effective_density_states(GaAs['hem'])
        G_ni_electron = intrinsic_concentration(G_nc_electron, G_nc_hole, G_Eg, T=T)

        A_Ec = AlGaAs['eaf'](c)
        A_Eg = AlGaAs['eg'](T, c)
        A_Ev = A_Ec + A_Eg
        A_Efi = fermi_energy_level(AlGaAs['hem'](c), AlGaAs['eem'](c), A_Eg, T)
        A_nc_electron = effective_density_states(AlGaAs['eem'](c), T)
        A_nc_hole = effective_density_states(AlGaAs['hem'](c))
        A_ni_electron = intrinsic_concentration(A_nc_electron, A_nc_hole, A_Eg, T=T)

        ctx = {
            'G_Ec': G_Ec,
            'G_Efi': G_Efi,
            'G_Ev': G_Ev,
            'G_Eg': G_Eg,
            'G_Nc_electron': np.format_float_scientific(G_nc_electron, unique=False, precision=3),
            'G_Nc_hole': np.format_float_scientific(G_nc_hole, unique=False, precision=3),
            'G_Ni_electron': G_ni_electron,
            'A_Ec': A_Ec,
            'A_Efi': A_Efi,
            'A_Ev': A_Ev,
            'A_Eg': A_Eg,
            'A_Nc_electron': np.format_float_scientific(A_nc_electron, unique=False, precision=3),
            'A_Nc_hole': np.format_float_scientific(A_nc_hole, unique=False, precision=3),
            'A_Ni_electron': A_ni_electron,
        }
        print(ctx)
        return JsonResponse(ctx)
