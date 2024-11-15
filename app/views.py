from django.shortcuts import render
from django.views.generic import View
import json
from django.http import JsonResponse
import numpy as np


h = 4.135667696e-15  # Constante de Planck [eV⋅s]
ħ = 6.582119569e-16  # Constante reducida de Planck [eV⋅s]
KB = 8.617333262e-5  # Constante de Boltzmann  [eV/K-1]
e = 1.602176634e-19  # Carga elemental [C]
me = 0.51099e6 / (29979245800)**2  # masa del electrón [eV/cm2]
epsilon0 = 55.263 * (e**2) / 10**(-4) # Permitividad del vacío [eV cm]

# ioffe
GaAs = {
    'eem': 0.067 * me,  # Electron effective mass mo * electron mass me
    'hem': 0.48 * me,  # Hole effective mass mo
    'eaf': 4.07  # Electron affinity eV
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
        Ec = GaAs['eaf']  # electron afinity
        Eg = passler(T)     # generar grafica T vs Eg
        Ev = Ec + Eg
        Efi = fermi_energy_level(GaAs['hem'], GaAs['eem'], Eg, T)
        nc_electron = effective_density_states(GaAs['eem'], T)
        nc_hole = effective_density_states(GaAs['hem'])
        ni_electron = intrinsic_concentration(nc_electron, Ec, Efi, 0, nc_type='e', T=T)
        ni_hole = intrinsic_concentration(nc_hole, 0, Efi, Ev, nc_type='h', T=T)
        ctx = {
            'Ec': Ec,
            'Efi': Efi,
            'Ev': Ev,
            'Eg': Eg,
            'Nc_electron': np.format_float_scientific(nc_electron, unique=False, precision=17),
            'Nc_hole': np.format_float_scientific(nc_hole, unique=False, precision=17),
            'Ni_electron': np.format_float_scientific(ni_electron, unique=False, precision=17),
            'Ni_hole': np.format_float_scientific(ni_hole, unique=False, precision=17),
            'Ec2': T + 4,
            'Efi2': c + 5,
            'Ev2': d + 3
        }
        print(ctx)
        return JsonResponse(ctx)


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
    nc = np.float64(nc)
    return nc


def intrinsic_concentration(nc, ec, efi, ev, nc_type='e', T=300.0):
    """
    intrinsic_concentration

    Parameters
    ----------
    nc: effective Density of States
    ec: conduction band
    efi: fermi energy level
    ev: valence band
    nc_type: effective density of states: 'e' (electron) or 'h' (hole)
    T: temperature

    """
    if nc_type == 'e':
        exp = np.exp(- (ec - efi) / (KB * T))
    else:
        exp = np.exp(- (efi - ev) / (KB * T))

    ni = nc * exp
    return ni
